using System;
using System.IO;

namespace jQuery_File_Upload.MVC3.Upload
{
    public class CustomFilesStatus
    {
        public const string HandlerPath = "/Upload/";

        public string group { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public int size { get; set; }
        public string progress { get; set; }
        public string url { get; set; }
        public string thumbnail_url { get; set; }
        public string delete_url { get; set; }
        public string delete_type { get; set; }
        public string error { get; set; }

        public CustomFilesStatus() { }

        public CustomFilesStatus(FileInfo fileInfo) { SetValues(fileInfo.Name, (int)fileInfo.Length, fileInfo.FullName); }

        public CustomFilesStatus(FileInfo fileInfo, string folder, string subfolder)
        {
            SetValues(fileInfo.Name, (int)fileInfo.Length, fileInfo.FullName, folder, subfolder);
        }

        public CustomFilesStatus(string fileName, int fileLength, string fullPath) { SetValues(fileName, fileLength, fullPath); }

        private void SetValues(string fileName, int fileLength, string fullPath, string folder = null, string subfolder = null)
        {
            name = fileName;
            type = "image/png";
            size = fileLength;
            progress = "1.0";
            url = HandlerPath + "CustomUploadHandler.ashx?f=" + fileName
                + (!string.IsNullOrWhiteSpace(fullPath) ? "&fp=" + fullPath : "");
                
            delete_url = HandlerPath + "CustomUploadHandler.ashx?f=" + fileName
                + (!string.IsNullOrWhiteSpace(fullPath) ? "&fp=" + fullPath : "");

            delete_type = "DELETE";

            var ext = Path.GetExtension(fullPath);

            var fileSize = ConvertBytesToMegabytes(new FileInfo(fullPath).Length);
            if (fileSize > 3 || !IsImage(ext)) thumbnail_url = "/Content/img/generalFile.png";
            else thumbnail_url = @"data:image/png;base64," + EncodeFile(fullPath);
        }

        private bool IsImage(string ext)
        {
            return ext == ".gif" || ext == ".jpg" || ext == ".png";
        }

        private string EncodeFile(string fileName)
        {
            return Convert.ToBase64String(System.IO.File.ReadAllBytes(fileName));
        }

        static double ConvertBytesToMegabytes(long bytes)
        {
            return (bytes / 1024f) / 1024f;
        }
    }
}