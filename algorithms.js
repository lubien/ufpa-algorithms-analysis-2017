exports.bubbleSort = function bubbleSort(xs) {
  const n = xs.length

  for (let i = 0; i < n - 1; i++) {
    let swapped = false

    for (let j = 0; j < n - 1; j++) {
      if (xs[j] > xs[j + 1]) {
        const tmp = xs[j]
        xs[j] = xs[j + 1]
        xs[j + 1] = tmp
        swapped = true
      }
    }

    if (!swapped) {
      break;
    }
  }

  return xs
}

exports.insertionSort = function insertionSort(xs) {
  const n = xs.length

  for (let i = 1; i < n; i++) {
    let j = i

    while (j > 0 && xs[j - 1] > xs[j]) {
      const tmp = xs[j - 1]
      xs[j - 1] = xs[j]
      xs[j] = tmp
      j--
    }
  }

  return xs
}

exports.selectionSort = function selectionSort(xs) {
  const n = xs.length

  for (let i = 0; i < n - 1; i++) {
    let x = i

    for (var j = i + 1; j < n; j++) {
      if (xs[j] < xs[x]) {
        x = j
      }
    }

    if (x !== i) {
      const tmp = xs[x]
      xs[x] = xs[i]
      xs[i] = tmp
    }
  }

  return xs
}

exports.quickSort = function quickSort(xs) {
  const n = xs.length

  if (n <= 1) {
    return xs
  }

  const pivot = xs[Math.floor(n / 2)]
  const [low, mid, high] = [[], [], []]

  for (let item of xs) {
    if (item < pivot) {
      low.push(item)
    } else if (item === pivot) {
      mid.push(item)
    } else {
      high.push(item)
    }
  }

  return quickSort(low).concat(mid).concat(quickSort(high))
}

exports.mergeSort = function mergeSort(xs) {
  const n = xs.length

  if (n <= 1) return xs

  const mid = Math.floor(n / 2)

  return merge
  ( mergeSort(xs.slice(0, mid))
  , mergeSort(xs.slice(mid))
  )
}

function merge(xs, ys) {
  const zs = []

  const [n1, n2] = [xs.length, ys.length]
  let [i, j] = [0, 0]

  while (i < n1 && j < n2) {
    if (xs[i] < ys[j]) {
      zs.push(xs[i])
      i++
    } else {
      zs.push(ys[j])
      j++
    }
  }

  for (; i < n1; i++) zs.push(xs[i])
  for (; j < n2; j++) zs.push(ys[j])

  return zs
}

exports.heapSort = function heapSort(xs) {
  const n = xs.length

  for (let start = Math.floor(n / 2); start >= 0; start--) {
    moveDown(xs, start, n - 1)
  }

  for (let end = n - 1; end > 0; end--) {
    const tmp = xs[end]
    xs[end] = xs[0]
    xs[0] = tmp
    moveDown(xs, 0, end - 1)
  }

  return xs
}

function moveDown(xs, root, end) {
  while (true) {
    let child = root * 2

    if (child > end) {
      break
    }

    if (child + 1 <= end && xs[child] < xs[child + 1]) {
      child++
    }

    if (xs[root] < xs[child]) {
      const tmp = xs[root]
      xs[root] = xs[child]
      xs[child] = tmp
      root = child
    } else {
      break
    }
  }
}

exports.countingSort = function countingSort(xs) {
  const n = xs.length
  const aux = Array(xs.reduce((a, b) => Math.max(a, b))).fill(0)

  for (let item of xs) {
    aux[item]++
  }

  const nAux = aux.length

  let sum = 0
  for (let i = 0; i < nAux; i++) {
    let dum = aux[i]
    aux[i] = sum
    sum += dum
  }

  const out = Array(n).fill(0)

  for (let item of xs) {
    out[aux[item]] = item
    aux[item] += 1
  }

  return out
}

exports.bucketSort = function bucketSort(xs) {
  const highest = xs.reduce((a, b) => Math.max(a, b))
  let buckets = Array(highest + 1).fill([])

  for (let item of xs) {
    buckets[item] = buckets[item].concat([item])
  }

  let out = []

  for (let bucket of buckets) {
    out = out.concat(bucket)
  }

  return out
}
