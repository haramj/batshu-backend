import { Request, Response } from "express";
import { spawn } from "child_process";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';


declare global {
  interface LocationObject {
    x : string;
    y : string;
  }

  interface video {

    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    path: string;
    filename: string;
    size: number;
  }

}



export const mosaicProcessing = async (req:Request, res: Response) => {
  try {

    // Section 1. 동영상 업로드 
    const uploadedVideo: video = req.file as Express.Multer.File;
    // TODO :  동영상 파일 이름 / 상태 (uploaded) -> INSERT

    const uploadedVideoOriginalName: string = uploadedVideo.originalname;
    const outputFileName = 'blurred_video.mp4'

    //console.log(process.cwd()); -> 현재 디렉토리 확인




    // Section 2. 동영상 모자이크 

    // TODO : 동영상 파일 이름 / 상태 (blurringStart) -> UPDATE

    // 스크립트 있는 폴더 경로
    const scriptDirectory = '/Users/jincheol/Desktop/BatShu-backend/src/DashcamCleaner';

    // 원하는 디렉토리로 이동
    process.chdir(scriptDirectory);


    const mosaicCommand = `python cli.py -i ${uploadedVideoOriginalName} -o ${outputFileName} -w 360p_nano_v8.pt`;

    const childProcess = spawn(mosaicCommand, { shell: true });


    // stdout 스트림 데이터를 콘솔에 출력
    childProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
  

    childProcess.on('close', (code) => {
      if (code === 0) {
        
        // TODO : 동영상 파일 이름 / 상태 (blurringDone) -> UPDATE

        console.log('Command execution successful');

      } else {
        console.error(`Command execution failed with code ${code}`);
      }
    });

    // Section 3. S3 INPUT BUCKET에 모자이크된 동영상 업로드



  } catch (error) {
    console.error('Error:', error);
    const resData: ApiResponse = {
       ok: false,
       msg: "INTERNAL SERVER ERROR"
    }
    res.status(500).json(resData);
  }
}



export const registerObserve = async (req:Request, res: Response) => {

}

export const getObserve = async (req:Request, res: Response) => {
    try{
      console.log(req.params.observeId);
  
    } catch (error) {
      console.error('Error:', error);
      const resData: ApiResponse = {
          ok: false,
          msg: "INTERNAL SERVER ERROR"
      }
      res.status(500).json(resData);
    }
  }
