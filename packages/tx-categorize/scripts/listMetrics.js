const  { contractAddressMap, methodIdMap, topicHashMap } = require('../dist/txSchemas/heuristicMap')

const main = () => {
    const protocols = new Set()
    const actions = new Set()
    const toAddressesNames = new Set()
    Object.values(contractAddressMap).forEach((contract) => {
      protocols.add(contract.protocol)
      toAddressesNames.add(contract.name)
    })
    Object.values(methodIdMap).forEach((method) => {
        protocols.add(method.protocol)
        actions.add(method.name)
    })
    Object.values(topicHashMap).forEach((topic) => {
        protocols.add(topic.protocol)
        actions.add(topic.name)
    })
    
    console.log('actions: ', Array.from(actions).sort())
    console.log('protocols: ', Array.from(protocols).sort())
    console.log('toAddressNames: ', Array.from(toAddressesNames).sort())

}
main()