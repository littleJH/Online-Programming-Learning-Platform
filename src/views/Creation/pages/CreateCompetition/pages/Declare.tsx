import { Button } from 'antd'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import myHooks from '@/tool/myHooks/myHooks'

const FunDeclaration: React.FC = () => {
  const [querys] = useSearchParams()
  const competition_id = querys.get('competition_id')
  const nav = myHooks.useNavTo()

  return (
    <div>
      <h3>比赛说明</h3>
      <p>
        <strong>ACM赛制</strong>
        ：每道题提交之后都有反馈，可以看到“通过”、“运行错误”、“答案错误”等等结果，但看不到错误的测试样例（leetcode周赛可以看到），每道题都有多个测试点，每道题必须通过了所有的测试点才算通过。每道题不限制提交次数，但没通过的话会有罚时，仅以最后一次提交为准。比赛过程中一般可以看到实时排名，通过题数相同的情况下按照答题时间+罚时来排名。
        ACM赛制的比赛：ICPC、CCPC、codeforces比赛、leetcode周赛及全国编程大赛、牛客小白赛练习赛挑战赛、传智杯。
      </p>
      <br />
      <p>
        <strong>OI赛制</strong>
        ：每道题提交之后都没有任何反馈，每道题都有多个测试点，根据每道题通过的测试点的数量获得相应的分数。每道题不限制提交次数，如果提交错误没有任何惩罚，仅以最后一次提交为准。比赛过程中看不到实时排名，赛后按照总得分来排名。
        OI赛制的比赛：NOI全国青少年信息学奥林匹克竞赛、CCF CSP、考研机试、蓝桥杯、牛客OI赛、全国高校计算机能力挑战赛。
      </p>
      <br />
      <p>
        <strong>IOI赛制</strong>
        ：每道题提交之后都有反馈，可以看到“通过”、“运行错误”、“答案错误”等等结果，甚至可以实时看到自己每道题得了多少分，但看不到错误的测试样例。每道题都有多个测试点，根据每道题通过的测试点的数量获得相应的分数。每道题不限制提交次数，如果提交错误没有任何惩罚，仅以最后一次提交为准。比赛过程中一般可以看到实时排名（如果是考试，一般看不到排名），按照总得分来排名。可以说，IOI赛制是结合了OI赛制和ACM赛制的特点。
        IOI赛制的比赛：PAT、团体程序设计天梯赛、CCF CCSP、洛谷月赛。
      </p>
      <div className="w-full flex justify-center mt-8">
        <Button
          type="primary"
          onClick={() =>
            nav(`/creation/competition/competition${competition_id ? `?competition_id=${competition_id}` : ''}`)
          }
        >
          我已知晓，下一步
        </Button>
      </div>
    </div>
  )
}

export default FunDeclaration
