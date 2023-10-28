import { IMonacoConfig } from '@/type'
import { Button, Col, Form, InputNumber, Row, Select, Switch } from 'antd'
import React, { useState } from 'react'

interface IProps {
  monacoConfig: IMonacoConfig
  setMonacoConfig: Function
}

const CodeEditorConfig: React.FC<IProps> = props => {
  const { monacoConfig, setMonacoConfig } = props
  const [form] = Form.useForm<IMonacoConfig>()
  const [config, setconfig] = useState<IMonacoConfig>()

  const handleFormChange = () => {
    const fieldsValue = form.getFieldsValue(true)
    const newConfig = {
      ...monacoConfig,
      options: {
        ...monacoConfig.options,
        ...fieldsValue
      }
    }
    setMonacoConfig(newConfig)
  }

  return (
    <Form
      form={form}
      name="monacoConfig"
      onValuesChange={handleFormChange}
      scrollToFirstError
      layout="vertical"
    >
      <h6 className="label">字体</h6>
      <Row gutter={32}>
        <Col span={12}>
          <Form.Item name={'fontSize'} label="字体大小">
            <Select
              defaultValue={monacoConfig.options.fontSize}
              options={fontSizeOptions}
            ></Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={'fontWeight'} label="字体粗细">
            <Select
              defaultValue={monacoConfig.options.fontWeight}
              options={fontWeightOptions}
            ></Select>
          </Form.Item>
        </Col>
      </Row>
      <h6 className="label">间距</h6>
      <Row gutter={32}>
        <Col span={12}>
          <Row gutter={32}>
            <Col span={8}>
              <Form.Item name={'lineHeight'} label="行高">
                <InputNumber
                  defaultValue={monacoConfig.options.fontSize}
                  min={0}
                  step={2}
                ></InputNumber>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={'letterSpacing'} label="字母间距">
                <InputNumber
                  defaultValue={monacoConfig.options.letterSpacing}
                  min={0}
                  step={1}
                ></InputNumber>
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Form.Item name={'padding'} label="边距" noStyle>
            <Row gutter={32}>
              <Col span={8}>
                <Form.Item name={'top'} label="上边距">
                  <InputNumber
                    defaultValue={monacoConfig.options.padding.top}
                    min={0}
                  ></InputNumber>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={'bottom'} label="下边距">
                  <InputNumber
                    defaultValue={monacoConfig.options.padding.bottom}
                    min={0}
                  ></InputNumber>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>

      <h6 className="label">滚轮/滚动</h6>
      <Row gutter={32}>
        <Col>
          <Form.Item
            name={'mouseWheelScrollSensitivity'}
            label="鼠标滚轮灵敏度"
          >
            <InputNumber
              defaultValue={monacoConfig.options.mouseWheelScrollSensitivity}
              min={1}
              step={1}
            ></InputNumber>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name={'mouseWheelZoom'}
            label="鼠标滚轮缩放"
            valuePropName="checked"
          >
            <Switch
              defaultChecked={monacoConfig.options.mouseWheelZoom}
            ></Switch>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name={'smoothScrolling'}
            label="平滑滚动"
            valuePropName="checked"
          >
            <Switch
              defaultChecked={monacoConfig.options.smoothScrolling}
            ></Switch>
          </Form.Item>
        </Col>
      </Row>

      <h6 className="label">其它</h6>
      <Form.Item
        name={'emptySelectionClipboard'}
        label="无选择复制时复制当前行"
        valuePropName="checked"
      >
        <Switch
          defaultChecked={monacoConfig.options.emptySelectionClipboard}
        ></Switch>
      </Form.Item>
      <Form.Item
        name={'scrollBeyondLastLine'}
        label="最后一行之后滚动一个屏幕尺寸"
        valuePropName="checked"
      >
        <Switch
          defaultChecked={monacoConfig.options.scrollBeyondLastLine}
        ></Switch>
      </Form.Item>
      <Form.Item
        name={'showUnused'}
        label="淡出未使用变量"
        valuePropName="checked"
      >
        <Switch defaultChecked={monacoConfig.options.showUnused}></Switch>
      </Form.Item>
      <Form.Item
        name={'cursorSmoothCaretAnimation'}
        label="光标平滑动画"
        valuePropName="checked"
      >
        <Select
          style={{
            width: '128px'
          }}
          defaultValue={monacoConfig.options.cursorSmoothCaretAnimation}
          options={cursorSmoothCaretAnimationOptions}
        ></Select>
      </Form.Item>
    </Form>
  )
}

export default CodeEditorConfig

const fontSizeOptions = [
  {
    label: <span style={{ fontSize: 8 }}>8px</span>,
    value: 8
  },
  {
    label: <span style={{ fontSize: 10 }}>10px</span>,
    value: 10
  },
  {
    label: <span style={{ fontSize: 12 }}>12px</span>,
    value: 12
  },
  {
    label: <span style={{ fontSize: 14 }}>14px</span>,
    value: 14
  },
  {
    label: <span style={{ fontSize: 16 }}>16px</span>,
    value: 16
  },
  {
    label: <span style={{ fontSize: 18 }}>18px</span>,
    value: 18
  },
  {
    label: <span style={{ fontSize: 20 }}>20px</span>,
    value: 20
  }
]

const fontWeightOptions = [
  {
    label: <span style={{ fontWeight: 400 }}>normal</span>,
    value: '400'
  },
  {
    label: <span style={{ fontWeight: 500 }}>semibold</span>,
    value: '500'
  },
  {
    label: <span style={{ fontWeight: 600 }}>medium</span>,
    value: '600'
  },
  {
    label: <span style={{ fontWeight: 700 }}>bold</span>,
    value: '700'
  }
]

const cursorSmoothCaretAnimationOptions = [
  {
    label: '启用',
    value: 'on'
  },
  {
    label: '停用',
    value: 'off'
  },
  {
    label: '显式',
    value: 'explicit'
  }
]
