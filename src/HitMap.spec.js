import HitMap from './HitMap'

test('should have 0 hits initially', () => {
  const map = new HitMap()

  expect(map.hits).toEqual(0)
})

test('should update the hits count', () => {
  const map = new HitMap()

  map.set('foo', {data: 'bar'})
  expect(map.hits).toEqual(0)

  const foo = map.get('foo')
  expect(foo.data).toEqual('bar')
  expect(map.hits).toEqual(1)
})
