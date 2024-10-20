import url from 'wa-sqlite/dist/wa-sqlite.wasm?url'
import { def, initSQLite, isOpfsSupported } from '../../src'
import { useOpfsStorage } from '../../src/vfs/opfs'
import { runSQLStream } from './runSQL'

onmessage = async () => {
  if (!await isOpfsSupported()) {
    return
  }
  const { run, stream, lastInsertRowId, changes, sqlite, db } = await initSQLite(useOpfsStorage(
    'test',
    { url },
    // 'https://cdn.jsdelivr.net/gh/rhashimoto/wa-sqlite@v0.9.9/dist/wa-sqlite.wasm',
  ))
  await runSQLStream(run, stream, data => postMessage(data))
  console.log(lastInsertRowId(), changes())
  def(sqlite, db, 'testtest', (a: number, b: number) => a + b)
  console.log(
    await run('select testtest(1,2)'),
  )
  postMessage('done')
}
