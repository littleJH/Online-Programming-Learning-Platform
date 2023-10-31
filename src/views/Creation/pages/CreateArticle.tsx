import { ICategory } from '@/type'
import { Select, Input, SelectProps, Button, Space, notification } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createArticleApi, createArticleLabelApi } from '@/api/article'
import Throttle from '@/tool/myFns/throttle'
import { useNavigate } from 'react-router-dom'
import Dragger from 'antd/es/upload/Dragger'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { uploadImgApi } from '@/api/img'
import { getCategoryListApi } from '@/api/category'
import TextEditor from '@/components/editor/TextEditor'
import { iconBaseUrl, imgBaseUrl, imgGetBaseUrl } from '@/config/apiConfig'

const options: SelectProps['options'] = []
const creation_article_title = localStorage.getItem('creation_article_title')
const creation_article_content = localStorage.getItem('creation_article_content')

const CreateArticle: React.FC<{}> = () => {
  const [title, settitle] = useState(creation_article_title ? creation_article_title : '')
  const [content, setcontent] = useState(creation_article_content ? creation_article_content : '')
  const [labels, setlabels] = useState([])
  const [category, setcategory] = useState('')
  const [categoryList, setcategoryList] = useState<ICategory[]>()
  const [iconUrl, setIconUrl] = useState<string>('')
  const [iconFile, setIconFile] = useState<UploadFile[]>([])
  const nav = useNavigate()

  useEffect(() => {
    getCategoryListApi().then((res) => {
      console.log(res.data)
      setcategoryList(res.data.data.categorys)
    })
  }, [])

  const categoryOptions = useMemo(() => {
    const options: SelectProps['options'] = []
    categoryList?.forEach((category) =>
      options.push({
        value: category.id,
        label: category.name
      })
    )
    return options
  }, [categoryList])

  const htmlChange = (value: string) => {
    setcontent(value)
    localStorage.setItem('creation_article_content', value)
  }

  const createArticle = () => {
    if (title === '' || content === '') {
      notification.warning({
        message: '标题/正文不能为空',
        placement: 'topRight'
      })
      return
    }
    createArticleApi(
      JSON.stringify({
        title,
        content,
        category,
        res_long:
          iconUrl !== ''
            ? JSON.stringify({
                img: iconUrl
              })
            : ''
      })
    )
      .then((res) => {
        console.log(res)
        const article = res.data.data.article
        if (res.data.code === 200) {
          settitle('')
          setcontent('')
          localStorage.removeItem('creation_article_title')
          localStorage.removeItem('creation_article_content')
          nav(`/community/article/${article.id}`)
        } else {
          notification.warning({
            message: '文章发布失败',
            description: res.data.msg,
            placement: 'topRight'
          })
        }
        return article.id
      })
      .then(async (id) => {
        let index = 0
        for (let label of labels) {
          const res = await createArticleLabelApi(id, label)
          index++
          console.log(res)
          if (res?.data.code !== 200) {
            notification.warning({
              message: `标签${label}创建失败`,
              description: res?.data.msg,
              placement: 'topRight'
            })
          }
        }
      })
  }

  const throttle = Throttle(createArticle, 1000)

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
      data: { code, data, msg }
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
    <div className='h-full w-full p-4 flex'>
      <div className='w-96 grow'>
        <TextEditor
          mode='richtext'
          value={content}
          htmlChange={(value: string) => htmlChange(value)}
          placeholder='开始你的创作~~~'
          style={{
            overflowY: 'hidden',
            minHeight: '300px'
          }}
        ></TextEditor>
      </div>
      <div className='w-72 ml-8'>
        <Space
          className='w-full'
          direction='vertical'
          size={'large'}
        >
          <Input
            autoFocus
            placeholder='标题'
            style={{}}
            size='large'
            value={title}
            onChange={handleInputChange}
          ></Input>
          <Select
            allowClear
            size='large'
            mode='tags'
            style={{
              display: 'block'
            }}
            placeholder={'创建标签'}
            onChange={(value) => setlabels(value)}
            options={options}
          ></Select>
          <Select
            placeholder='选择分类'
            size='large'
            style={{
              display: 'block'
            }}
            options={categoryOptions}
            onSelect={(value) => setcategory(value)}
          ></Select>
          <Dragger
            style={{
              width: '100%'
            }}
            className='text-slate-500'
            name='file'
            // customRequest={uploadImg}
            beforeUpload={beforeUpload}
            onRemove={handleRemove}
            fileList={iconFile}
          >
            {iconUrl !== '' ? (
              <img
                src={`${imgGetBaseUrl}/${iconUrl}`}
                alt='封面'
                style={{ width: '100%' }}
              ></img>
            ) : (
              <div className='my-16'>拖拽或点击上传“封面”</div>
            )}
          </Dragger>
          <div className='flex justify-center'>
            <Button
              onClick={() => throttle([])}
              type='primary'
              size='large'
            >
              点击发布
            </Button>
          </div>
        </Space>
      </div>
    </div>
  )
}

export default CreateArticle
