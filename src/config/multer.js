import multer from 'multer';

// Configuramos para armazenar na memória (RAM) temporariamente
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;