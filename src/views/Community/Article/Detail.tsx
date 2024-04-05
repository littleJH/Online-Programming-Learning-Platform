import { IArticle } from '@/type'
import React, { useEffect, useMemo, useState } from 'react'
import { currentArticleState, isMobileAtom, sideBarTypeState } from '@/store/appStore'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { useParams } from 'react-router-dom'
import {
  collectArticleApi,
  deleteCollectArticleApi,
  deleteLikeArticleApi,
  getArticleApi,
  getArticleCollectNumApi,
  getArticleCollectedApi,
  getArticleLabelsApi,
  getArticleLikeNumApi,
  getArticleLikedApi,
  getArticleVisibleNumApi,
  likeArticleApi,
  setArticleVisibleApi,
} from '@/api/article'
import { createArticleRemarkApi, getArticleRemarkListApi } from '@/api/remark'
import { getUserInfoApi } from '@/api/user'
import ReadOnly from '@/components/editor/Readonly'
import { Button, Divider, Modal, Space, Card, theme, Drawer } from 'antd'
import MyTag from '@/components/Label/MyTag'
import TextEditor from '@/components/editor/TextEditor'
import RemarkCard from '@/components/Card/RemarkCard'
import SideActionBar from '@/components/SideActionBar/SideActionBar'
import utils from '@/tool/myUtils/utils'
import { directoryDataState } from '@/components/directory/store'
import myHooks from '@/tool/myHooks/myHooks'
import style from '../style.module.scss'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import Directory from '@/components/directory/Directory'
import { imgGetBaseUrl } from '@/config/apiConfig'

const Detail: React.FC = () => {
  const isMobile = useRecoilValue(isMobileAtom)
  const { article_id = '' } = useParams<string>()
  const [currentArticle, setcurrentArticle] = useRecoilState(currentArticleState)
  const [openRemarkModal, setopenRemarkModal] = useState(false)
  const [remarkContent, setremarkContent] = useState('')
  const [openDirectoryDrawer, setOpenDirectoryDrawer] = useState(false)
  const setDirectoryTree = useSetRecoilState(directoryDataState)
  const setSidebarType = useSetRecoilState(sideBarTypeState)
  const { token } = theme.useToken()

  const imgUrl = useMemo(
    () =>
      currentArticle &&
      currentArticle.res_long &&
      currentArticle.res_long !== '' &&
      JSON.parse(currentArticle.res_long).img,
    [currentArticle]
  )

  // 监听content滚动
  myHooks.useListenContentScroll({ followScroll: true })

  useEffect(() => {
    setSidebarType('directory')
    return () => {
      setcurrentArticle(null)
      setSidebarType('none')
    }
  }, [])

  useEffect(() => {
    typeof currentArticle?.likeNum !== 'number' && fetch()
    setArticleVisibleApi(article_id)
  }, [currentArticle])

  useEffect(() => {
    const articleEl = document.getElementById('article')
    if (currentArticle && articleEl) {
      const toc = utils.generateTOC(articleEl)
      setDirectoryTree(toc)
    }
  }, [currentArticle])

  const fetch = async () => {
    const res = await Promise.all([
      getArticleApi(article_id),
      getArticleLikedApi(article_id),
      getArticleLikeNumApi(article_id, 'true'),
      getArticleCollectedApi(article_id),
      getArticleCollectNumApi(article_id),
      getArticleVisibleNumApi(article_id),
      getArticleLabelsApi(article_id),
      getArticleRemarkListApi(article_id),
    ])
    const article: IArticle = res[0].data.data.article
    article.liked = res[1].data.data.like
    article.likeNum = res[2].data.data.total
    article.collected = res[3].data.data.collect
    article.collectNum = res[4].data.data.total
    article.visibleNum = res[5].data.data.total
    article.labels = res[6].data.data.articleLabels
    article.remark = {
      remarks: res[7].data.data.remarks,
      total: res[7].data.data.total,
    }
    const userRes = await getUserInfoApi(article.user_id)
    article.user = userRes.data.data.user
    setcurrentArticle(article)
  }

  const handleLikeClick = () => {
    const like = () => {
      likeArticleApi(article_id, 'true').then(async (res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentArticle) {
          const { data } = await getArticleLikeNumApi(article_id, 'true')
          console.log(data)
          setcurrentArticle((value) => {
            return {
              ...value,
              liked: 1,
              likeNum: data.data.total,
            } as IArticle
          })
        }
      })
    }
    const cancelLike = () => {
      deleteLikeArticleApi(article_id).then(async (res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentArticle) {
          const { data } = await getArticleLikeNumApi(article_id, 'true')
          setcurrentArticle((value) => {
            return {
              ...value,
              liked: 0,
              likeNum: data.data.total,
            } as IArticle
          })
        }
      })
    }
    currentArticle?.liked === 1 ? cancelLike() : like()
  }

  const handleMenubtnClick = () => {
    setOpenDirectoryDrawer(true)
  }

  const handleCollectClick = () => {
    const collect = () => {
      collectArticleApi(article_id).then(async (res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentArticle) {
          const { data } = await getArticleCollectNumApi(article_id)
          setcurrentArticle((value) => {
            return {
              ...value,
              collected: true,
              collectNum: data.data.total,
            } as IArticle
          })
        }
      })
    }
    const cancelCollect = () => {
      deleteCollectArticleApi(article_id).then(async (res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentArticle) {
          const { data } = await getArticleCollectNumApi(article_id)
          setcurrentArticle((value) => {
            return {
              ...value,
              collected: false,
              collectNum: data.data.total,
            } as IArticle
          })
        }
      })
    }
    currentArticle?.collected ? cancelCollect() : collect()
  }
  const handleSubmitRemarkClick = () => {
    console.log(remarkContent)
    createArticleRemarkApi(
      article_id,
      JSON.stringify({
        content: remarkContent,
      })
    ).then(async (res) => {
      if (res.data.code === 200) {
        setopenRemarkModal(false)
        setremarkContent('')
        const { data } = await getArticleRemarkListApi(article_id)
        setcurrentArticle((value) => {
          return {
            ...value,
            remark: {
              remarks: data.data.remarks,
              total: data.data.total,
            },
          } as IArticle
        })
      }
    })
  }

  const handleCommentClick = () => {
    const a = document.createElement('a')
    a.href = '#remark'
    a.click()
  }

  const handleArrowupClick = () => {
    const a = document.createElement('a')
    a.href = '#top'
    a.click()
  }

  return (
    <div className={style.articleDetail}>
      {currentArticle && (
        <div className={style.content}>
          <div id="top"></div>
          <Card size="small">
            {/* header */}
            <div
              className={style.header}
              style={{
                backgroundColor: token.colorBgBase,
              }}
            >
              <h1 className={style.title}>{currentArticle.title}</h1>
              <Space
                size={'large'}
                className={style.authorLine}
                style={{
                  color: token.colorTextDescription,
                }}
              >
                <span>{currentArticle.user?.name}</span>
                <span>{currentArticle.created_at}</span>
                <span className="flex items-center">
                  <MySvgIcon href={'#icon-visible'} color={token.colorTextDescription}></MySvgIcon>
                  <span className="ml-2">{currentArticle.visibleNum}</span>
                </span>
              </Space>

              <Space className={style.labelLine}>
                {currentArticle.labels &&
                  currentArticle.labels.map((label, index) => <MyTag key={index}>{label.label}</MyTag>)}
              </Space>
            </div>
            <img className={style.myImg} src={`${imgGetBaseUrl}/${imgUrl}`} alt="" />
            <Divider style={{ margin: '1rem' }}></Divider>
            {/* body */}
            <div id="article">
              <ReadOnly html={currentArticle.content} borderd={false}></ReadOnly>
            </div>
          </Card>
          {/* remark */}
          <div id="remark">
            <div className="flex justify-center">
              <Button type="dashed" className="shadow m-4" onClick={() => setopenRemarkModal(true)}>
                #我有一言
              </Button>
            </div>
            <div>
              {currentArticle.remark &&
                currentArticle.remark.remarks.map((remark) => (
                  <RemarkCard remark={remark} key={remark.id}></RemarkCard>
                ))}
            </div>
          </div>
          {/* <div className='w-8'></div> */}
          {/* <div className='w-64 h-96 shadow rounded '></div> */}

          <div
            className={`w-12 h-12 px-4 fixed top-1/3 right-0 flex flex-col`}
            style={{
              translate: '-50% -50%',
            }}
          >
            <SideActionBar
              onArrowupClick={handleArrowupClick}
              onCollectClick={handleCollectClick}
              onCommentClick={handleCommentClick}
              onLikeClick={handleLikeClick}
              onMenubtnClick={isMobile ? handleMenubtnClick : null}
              likeNum={currentArticle?.likeNum || 0}
              collectNum={currentArticle?.collectNum || 0}
              remarkNum={currentArticle?.remark.total || 0}
              liked={currentArticle?.liked || 0}
              collected={currentArticle?.collected || false}
            ></SideActionBar>
          </div>
          <Modal
            open={openRemarkModal}
            onCancel={() => setopenRemarkModal(false)}
            footer={[
              <Button key="submit" type="primary" onClick={handleSubmitRemarkClick}>
                发布
              </Button>,
            ]}
            title={'我有一言'}
          >
            <TextEditor
              mode="markdown"
              value={remarkContent}
              htmlChange={(value: string) => setremarkContent(value)}
              placeholder="发表我的看法~~~"
            ></TextEditor>
          </Modal>
          <Drawer
            open={openDirectoryDrawer}
            placement="bottom"
            onClose={() => setOpenDirectoryDrawer(false)}
            closeIcon={false}
            zIndex={9999999}
            style={{
              opacity: '0.9',
            }}
          >
            <Directory></Directory>
          </Drawer>
        </div>
      )}
    </div>
  )
}

export default Detail
