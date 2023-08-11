const oj: any = {
  POJ: '00000001',
  HDU: '00000002',
  SPOJ: '00000003',
  VIJOS: '00000004',
  CF: '00000005',
  UVA: '00000006',
  UOJ: '00000007',
  URAL: '00000008',
  HACKERRANK: '00000009',
  ATCODER: '0000000a'
}

const ojmap = new Map()

Object.keys(oj).forEach(key => {
  ojmap.set(oj[key], key)
})

console.log(ojmap)
export default ojmap
