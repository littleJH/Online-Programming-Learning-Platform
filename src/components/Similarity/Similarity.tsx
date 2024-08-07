import React, { useEffect } from 'react'
import * as echarts from 'echarts/core'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { GraphChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

const Similarity: React.FC = () => {
  useEffect(() => {
    echarts.use([TitleComponent, TooltipComponent, GraphChart, CanvasRenderer])
    initEcharts()
  }, [])

  const initEcharts = () => {
    const size = 20
    let similarityMatrix: any = []

    for (let i = 0; i < size; i++) {
      similarityMatrix[i] = []
      for (let j = 0; j < size; j++) {
        if (i === j) {
          similarityMatrix[i][j] = 1 // 对角线值设为1，表示自相似
        } else if (j > i) {
          // 生成一个0到1之间的随机相似度值
          similarityMatrix[i][j] = parseFloat(Math.random().toFixed(2))
        } else {
          // 确保矩阵是对称的
          similarityMatrix[i][j] = similarityMatrix[j][i]
        }
      }
    }

    let nodes: any[] = []
    let edges: any[] = []

    for (let i = 0; i < similarityMatrix.length; i++) {
      nodes.push({ id: i, name: `${i + 1}` })
      for (let j = i + 1; j < similarityMatrix[i].length; j++) {
        if (similarityMatrix[i][j] > 0.9) {
          // 根据需要过滤掉相似度极低的边
          edges.push({
            source: i,
            target: j,
            label: {
              show: true,
            },
            weight: similarityMatrix[i][j],
          })
        }
      }
    }
    console.log(nodes, edges)
    const options: any = {
      title: {
        text: '相似度',
      },
      tooltip: {
        show: true,
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            return '选手名称：xxx<br>选手id：xxx'
          } else if (params.dataType === 'edge') {
            return '相似度：' + params.data.weight
          }
        },
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'force',
          data: nodes,
          links: edges,
          roam: true,
          force: {
            // 力导向图的力学算法参数
            repulsion: 1000,
            edgeLength: [100, 200],
          },
          symbolSize: 50,
          edgeSymbol: [],
          edgeSymbolSize: [4, 10],
          label: {
            show: true,
          },
          edgeLabel: {
            normal: {
              show: true, // 显示边的标签
              textStyle: {
                fontSize: 12, // 边标签的字体大小
              },
              formatter: function (params: any) {
                // params是边的数据项
                return params.data.weight // 返回边的权重值作为标签文本
              },
            },
          },
          lineStyle: {
            opacity: 0.9,
            width: 4,
            curveness: 0,
          },
        },
      ],
    }
    const myChart = echarts.init(document.getElementById('similarity'))
    myChart.setOption(options)
  }

  return (
    <div
      id="similarity"
      style={{
        width: '1000px',
        height: '800px',
      }}
    ></div>
  )
}

export default Similarity
