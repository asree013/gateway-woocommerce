import { diskStorage } from 'multer';
import { extname } from 'path';

export const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

function generateFilename(file) {
  const date = new Date();
  const iso = date.toISOString();
  const todays = iso.replace('T', '-T').replace(':', '-').replace(':', '-');
  const splits = todays.split(/[.,!,?]/);
  return `${splits[0]}s${extname(file.originalname)}`;
}
