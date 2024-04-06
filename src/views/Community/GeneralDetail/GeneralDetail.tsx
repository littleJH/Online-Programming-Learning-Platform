import { IArticle, IPost } from '@/type'
import React, { useEffect, useMemo, useState } from 'react'
import { isMobileAtom, sideBarTypeState } from '@/store/appStore'
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

interface IProps {
  currentObject: IArticle | IPost | null
  openRemarkModal: boolean
  setOpenRemarkModal: (value: boolean) => void
  onArrowupClick: () => void
  onCollectClick: () => void
  onCommentClick: () => void
  onLikeClick: () => void
  onSubmitRemarkClick: () => void
}

const GeneralDetail: React.FC<IProps> = (props) => {
  const {
    currentObject,
    openRemarkModal,
    setOpenRemarkModal,
    onArrowupClick,
    onCollectClick,
    onCommentClick,
    onLikeClick,
    onSubmitRemarkClick,
  } = props
  const isMobile = useRecoilValue(isMobileAtom)
  const [remarkContent, setremarkContent] = useState('')
  const [openDirectoryDrawer, setOpenDirectoryDrawer] = useState(false)
  const setDirectoryTree = useSetRecoilState(directoryDataState)
  const setSidebarType = useSetRecoilState(sideBarTypeState)
  const { token } = theme.useToken()

  // 监听content滚动
  myHooks.useListenContentScroll({ followScroll: true })

  useEffect(() => {
    setSidebarType('directory')
    const articleEl = document.getElementById('article')
    if (currentObject && articleEl) {
      const toc = utils.generateTOC(articleEl)
      setDirectoryTree(toc)
    }
    return () => {
      setSidebarType('none')
    }
  }, [currentObject])

  const imgUrl = useMemo(
    () =>
      currentObject &&
      currentObject.res_long &&
      currentObject.res_long !== '' &&
      JSON.parse(currentObject.res_long).img,
    [currentObject]
  )

  return (
    <div className={style.articleDetail}>
      {currentObject && (
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
              <h1 className={style.title}>{currentObject.title}</h1>
              <Space
                size={'large'}
                className={style.authorLine}
                style={{
                  color: token.colorTextDescription,
                }}
              >
                <span>{currentObject.user?.name}</span>
                <span>{currentObject.created_at}</span>
                <span className="flex items-center">
                  <MySvgIcon href={'#icon-visible'} color={token.colorTextDescription}></MySvgIcon>
                  <span className="ml-2">{currentObject.visibleNum}</span>
                </span>
              </Space>

              <Space className={style.labelLine}>
                {currentObject.labels &&
                  currentObject.labels.map((label, index) => <MyTag key={index}>{label.label}</MyTag>)}
              </Space>
            </div>
            <img className={style.myImg} src={`${imgGetBaseUrl}/${imgUrl}`} alt="" />
            <Divider style={{ margin: '1rem' }}></Divider>
            {/* body */}
            <div id="article">
              <ReadOnly html={currentObject.content} borderd={false}></ReadOnly>
            </div>
          </Card>
          {/* remark */}
          <div id="remark">
            <div className="flex justify-center">
              <Button type="dashed" className="shadow m-4" onClick={() => setOpenRemarkModal(true)}>
                #我有一言
              </Button>
            </div>
            <div>
              {currentObject.remark &&
                currentObject.remark.remarks.map((remark) => <RemarkCard remark={remark} key={remark.id}></RemarkCard>)}
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
              onArrowupClick={onArrowupClick}
              onCollectClick={onCollectClick}
              onCommentClick={onCommentClick}
              onLikeClick={onLikeClick}
              onMenubtnClick={() => isMobile && setOpenDirectoryDrawer(true)}
              likeNum={currentObject?.likeNum || 0}
              collectNum={currentObject?.collectNum || 0}
              remarkNum={currentObject?.remark?.total || 0}
              liked={currentObject?.liked || 0}
              collected={currentObject?.collected || false}
            ></SideActionBar>
          </div>
          <Modal
            open={openRemarkModal}
            onCancel={() => setOpenRemarkModal(false)}
            footer={[
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  onSubmitRemarkClick()
                }}
              >
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

export default GeneralDetail
