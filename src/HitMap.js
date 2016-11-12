class HitMap {
  constructor () {
    this._map = new Map()

    this._hits = 0
  }

  get hits () {
    return this._hits
  }

  set (key, value) {
    const data = value.data

    Object.defineProperty(value, 'data', {
      get: () => {
        this._hits++
        return data
      }
    })

    this._map.set(key, value)
  }

  get (key) {
    return this._map.get(key)
  }

  has (key) {
    return this._map.has(key)
  }
}

export default HitMap
