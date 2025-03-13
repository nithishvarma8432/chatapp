This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
 
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


Update Firestore database Rules to:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // This rule applies only to the 'messages' collection
    match /messages/{messageId} {
      // Allow read and write if the user is authenticated
      allow read, write: if request.auth != null;
    }
    // Other collections or documents remain locked
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
