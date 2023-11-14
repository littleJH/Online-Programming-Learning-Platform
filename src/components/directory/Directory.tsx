import React from 'react'
import { Tree } from 'antd'
import { useRecoilState, useRecoilValue } from 'recoil'
import { directoryDataState, directorySelectKeysState } from './store'

const Directory: React.FC = () => {
  const treeData = useRecoilValue(directoryDataState)
  const [directorySelectKeys, setDirectorySelectKeys] = useRecoilState(directorySelectKeysState)

  const handleDirectorySelect = (keys: any) => {
    console.log('handleDirectorySelect ==> ', keys)
    const a = document.createElement('a')

    if (keys.length > 0) {
      setDirectorySelectKeys(keys)
      a.href = `#${keys[0]}`
      a.click()
    } else if (keys.length === 0) {
      a.href = `#${directorySelectKeys[0]}`
      a.click()
      setDirectorySelectKeys(directorySelectKeys)
    }
  }
  return (
    <>
      {treeData.length > 0 && (
        <Tree
          treeData={treeData}
          defaultExpandAll={true}
          selectedKeys={directorySelectKeys}
          onSelect={handleDirectorySelect}
        ></Tree>
      )}
    </>
  )
}

export default Directory
