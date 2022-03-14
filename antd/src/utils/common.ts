// 文件分割的方法
export function createFileChunk(file, size) {
  const fileChunkList: object[] = [];
  let count = 0;
  let num = 1;
  while (count < file.size) {
    fileChunkList.push({
      file: file.slice(count, count + size),
      partNumber: num,
    });
    count += size;
    num++;
  }
  return fileChunkList;
}
