import Compressor from "compressorjs";
export const reduceUserImg = (file) => {
    new Compressor(file, {
        maxHeight: 300,
        maxWidth: 300,
        minHeight: 150,
        minWidth: 150,
        success: file => {
            return file;
        }
    });
}