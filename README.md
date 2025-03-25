## Aurelius SocialMediApp built using nextjs 14.2 , Recoil , chakraUi. 
It is entirely done in next.js leveraging the next.js client server component. Database used in for the project is firebase and Minio. Firebase for user authentication. Minio is for storing the media files. You can create post, create groups/communities share photos videos. 


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Add your firebase credential in the env file 

add .env.local file in the project. enviroment file will contain the Firebase credentials and Minio database.
i have local instance of MinIO database using docker. 

example 
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# locally running minio database instance 
NEXT_PUBLIC_MINIO_ENDPOINT=localhost
NEXT_PUBLIC_MINIO_PORT=1234
NEXT_PUBLIC_MINIO_USE_SSL=false
NEXT_PUBLIC_MINIO_ACCESS_KEY=username
NEXT_PUBLIC_MINIO_SECRET_KEY=password
```


