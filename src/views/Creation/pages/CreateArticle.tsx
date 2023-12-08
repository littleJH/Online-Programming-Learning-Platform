import { IArticle, IArticleLabel, ICategory } from '@/type'
import {
  Select,
  Input,
  SelectProps,
  Button,
  Space,
  notification,
  Card,
} from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import {
  createArticleApi,
  createArticleLabelApi,
  getArticleApi,
  getArticleLabelsApi,
  updateArticleApi,
} from '@/api/article'
import Throttle from '@/tool/myFns/throttle'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Dragger from 'antd/es/upload/Dragger'
import { UploadFile } from 'antd/es/upload'
import { uploadImgApi } from '@/api/img'
import { getCategoryListApi } from '@/api/category'
import TextEditor from '@/components/editor/TextEditor'
import { imgGetBaseUrl } from '@/config/apiConfig'

const creation_article_title = localStorage.getItem('creation_article_title')
const creation_article_content = localStorage.getItem(
  'creation_article_content',
)

const CreateArticle: React.FC = () => {
  const nav = useNavigate()
  const [querys, setQuerys] = useSearchParams()
  const [title, settitle] = useState('')
  const [content, setcontent] = useState('')
  const [labels, setlabels] = useState<string[]>([])
  const [category, setcategory] = useState('')
  const [categoryList, setcategoryList] = useState<ICategory[]>()
  const [iconUrl, setIconUrl] = useState<string>('')
  const [iconFile, setIconFile] = useState<UploadFile[]>([])
  const article_id = querys.get('article_id')

  const labelsOptions = useMemo(
    () =>
      labels.map(item => {
        return { label: item }
      }),
    [labels],
  )

  useEffect(() => {
    if (article_id) {
      getArticleApi(article_id).then(res => {
        const article: IArticle = res.data.data.article
        settitle(article.title)
        setcontent(article.content)
        setcategory(article.category_id)
        if (article.res_long !== '') {
          const icon = JSON.parse(article.res_long).img
          icon && setIconUrl(icon)
        }
      })
      getArticleLabelsApi(article_id).then(res => {
        const labels = res.data.data.articleLabels
        labels.length !== 0 &&
          setlabels(labels.map((item: IArticleLabel) => item.label))
      })
    } else {
      settitle(creation_article_title || '')
      setcontent(creation_article_content || '')
    }
    getCategoryListApi().then(res => {
      console.log(res.data)
      setcategoryList(res.data.data.categorys)
    })
  }, [])

  const categoryOptions = useMemo(() => {
    const options: SelectProps['options'] = []
    categoryList?.forEach(category =>
      options.push({
        value: category.id,
        label: category.name,
      }),
    )
    return options
  }, [categoryList])

  const htmlChange = (value: string) => {
    setcontent(value)
    localStorage.setItem('creation_article_content', value)
  }

  const submit = async () => {
    if (title === '' || content === '') {
      notification.warning({
        message: '标题/正文不能为空',
      })
      return
    }

    const cb = async (res: any) => {
      const article = res.data.data.article
      if (res.data.code === 200) {
        settitle('')
        setcontent('')
        localStorage.removeItem('creation_article_title')
        localStorage.removeItem('creation_article_content')
        let index = 0
        for (let label of labels) {
          const res = await createArticleLabelApi(article.id, label)
          console.log(res)
          if (res?.data.code !== 200) {
            notification.warning({
              message: `标签${label}创建失败`,
              description: res?.data.msg,
            })
          }
          index++
        }
        nav(`/community/article/${article.id}`)
      } else {
        notification.warning({
          message: `文章${article_id ? '更新' : '发布'}失败`,
          description: res.data.msg,
        })
      }
    }

    const data = JSON.stringify({
      title,
      content,
      category,
      res_long:
        iconUrl !== ''
          ? JSON.stringify({
              img: iconUrl,
            })
          : '',
    })
    article_id
      ? cb(await updateArticleApi(article_id, data))
      : cb(await createArticleApi(data))
  }

  const throttle = Throttle(submit, 1000)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    settitle(e.target.value)
    localStorage.setItem('creation_article_title', e.target.value)
  }

  const uploadImg = async (file: UploadFile) => {
    file.status = 'uploading'
    setIconFile([file])
    const form = new FormData()
    form.append('file', file as any)
    const {
      data: { code, data, msg },
    } = await uploadImgApi(form)
    if (code === 200) {
      file.status = 'done'
      file.url = `${imgGetBaseUrl}/${data.Icon}`
      setIconUrl(`${data.Icon}`)
      setIconFile([file])
    }
  }

  const beforeUpload = (file: UploadFile) => {
    uploadImg(file)
  }

  const handleRemove = () => {
    setIconFile([])
    setIconUrl('')
  }

  return (
    <div className="h-full w-full p-4 flex">
      <Card
        size="small"
        className="grow"
        bodyStyle={{
          padding: '0px',
          height: '100%',
        }}
      >
        <TextEditor
          mode="richtext"
          value={content}
          htmlChange={(value: string) => htmlChange(value)}
          placeholder="开始你的创作~~~"
        ></TextEditor>
      </Card>
      <Card size="small" bordered={false} className="w-96 ml-8">
        <Space className="w-full" direction="vertical" size={'large'}>
          <Input
            autoFocus
            placeholder="标题"
            style={{}}
            size="large"
            value={title}
            onChange={handleInputChange}
          ></Input>
          <Select
            allowClear
            size="large"
            mode="tags"
            style={{
              display: 'block',
            }}
            placeholder={'创建标签'}
            onChange={value => setlabels(value)}
            options={labelsOptions}
            value={labels}
          ></Select>
          <Select
            placeholder="选择分类"
            size="large"
            style={{
              display: 'block',
            }}
            options={categoryOptions}
            onSelect={value => setcategory(value)}
          ></Select>
          <Dragger
            style={{
              width: '100%',
            }}
            className="text-slate-500"
            name="file"
            // customRequest={uploadImg}
            beforeUpload={beforeUpload}
            onRemove={handleRemove}
            fileList={iconFile}
          >
            {iconUrl !== '' ? (
              <img
                src={`${imgGetBaseUrl}/${iconUrl}`}
                alt="封面"
                style={{ width: '100%' }}
              ></img>
            ) : (
              <div className="my-16">拖拽或点击上传“封面”</div>
            )}
          </Dragger>
          <div className="flex justify-center">
            <Button onClick={() => throttle([])} type="primary" size="large">
              {article_id ? '更新' : '发布'}
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default CreateArticle
