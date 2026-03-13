const formatValue = (value) => {
  if (value === null) {
    return 'null'
  }
  if (typeof value === 'string') {
    return `'${value}'`
  }
  if (typeof value === 'object') {
    return '[complex value]'
  }
  return String(value)
}

const buildPath = (path) => {
  return path.join('.')
}

const plain = (diff, path = []) => {
  return diff.flatMap((node) => {
    const { key, type } = node
    const currentPath = [...path, key]
    const propertyPath = buildPath(currentPath)

    switch (type) {
      case 'nested':
        return plain(node.children, currentPath)
      case 'added':
        return `Property '${propertyPath}' was added with value: ${formatValue(node.value)}`
      case 'deleted':
        return `Property '${propertyPath}' was removed`
      case 'changed':
        return `Property '${propertyPath}' was updated. From ${formatValue(node.value1)} to ${formatValue(node.value2)}`
      case 'unchanged':
        return []
      default:
        return []
    }
  })
}

const formatPlain = (diff) => {
  const lines = plain(diff)
  return lines.join('\n')
}

export default formatPlain
