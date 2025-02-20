
# Resume analysis




## Run Locally

Clone the project

```bash
  git clone https://github.com/devMukulSingh/NeobuildAssignment.git
```

Install dependencies

```bash
  bun install or npm install
```
Rename .env.example to .env and enter `DATABASE_URL`,`GEMINI_API_KEY` and `JWT_SECRET`

Start the server

```bash
  bun run dev or bun run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`

`JWT_SECRET`

`GEMINI_API_KEY`


## API Reference

### 1. Register new user

```http
  POST /api/v1/auth/register
```
- **Description:** Register a new user using name, email and password.
- **Request Body**:

      {
        "name":"Mukul singh bisht",
        "email":"mukulsingh2276@gmail.com",
        "password":"1234"
      }
- **Success Responses:**

      201 {"msg":"User registered successfully" }
- **Error Responses**

      400 {"error": ["field" is required] }
      409 {"error": "User already exists"}
      500 {"error": "Intenal server error"}

### 2. Login 
```http
  POST /api/v1/auth/login
```
- **Description:** Login user using email and password.
- **Request Body**:

      {
        "email":"mukulsingh2276@gmail.com",
        "password":"1234"
      }
- **Success Responses:**

      200 {"JWT":"ey.121212.dfsdfsdfsda.sd12121"}
- **Error Responses**

      400 {"error" : ['field' is required]}
      400 {"error" :"Invalid credentials"} 
      409 {"error" : 'User already exists'}
      500 {"error" : 'Intenal server error'}

  ### 3. Create applicant 
```http
  POST /api/v1/applicant/:userId/create-applicant
```
- **Description:** Parses raw data and create an applicant record in the db based on raw resume data.
- **Path parameters:** userId:"67b5dbd2e76a55f64e76638f".

- **Request Body**:

      {
        "raw_data":"Scarlett Emerson has email-scarlett.emerson@hollywoodstudios.com. She went to UCLA...Bachelor of Fine Arts, Film Production in Acting specialization & passed out in 2015."
      }
- **Success Responses:**

      200 {"JWT":"ey.121212dfsdfsdfsdasd"}

- **Error Responses**

      400 {"error":["field" is required]}
      400 {"error":"Invalid credentials"} 
      401 {"error":"Unauthenticated, token not found" }
      401 {"error":"Unauthenticated, invalid userId" }
      401 {"error":"Unauthenticated, invalid token" }
      401 {"error":"Unauthenticated, user not found"}
      500 {"error":"Intenal server error"}

    ### 4. Get applicant 
```http
  POST /api/v1/applicant/:userId/get-applicant
```
- **Description:** Queries applicants in the database based on the name of the applicant.
- **Path parameters:** userId:"67b5dbd2e76a55f64e76638f".
- **Request Body**:

      {
        "name":"Scarlett Emerson"
      }
- **Success Responses:**

      200 {"applicants": [
        {
            "id": "67b6b7836b23f5f238afac90",
            "userId": "67b5dbd2e76a55f64e76638f",
            "name": "Scarlett Emerson",
            "email": "scarlett.emerson@hollywoodstudios.com",
            "summary": "Scarlett Emerson is a film professional with experience in directing, cinematography, editing, screenwriting, VFX, and storyboarding. She graduated from UCLA with a Bachelor of Fine Arts in Film Production and has worked as an Assistant Director at Paramount Pictures since June 2018.",
            "skills": [
                "Cinematography",
                "editing (Final Cut Pro)",
                "screenwriting",
                "directing",
                "VFX",
                "storyboards"
            ],
            "createdAt": "2025-02-20T05:02:59.125Z",
            "updatedAt": "2025-02-20T05:02:59.125Z"
        },
      ]
      }

- **Error Responses**

      400 {"error":["field" is required]}
      400 {"error":"Invalid credentials"} 
      401 {"error":"Unauthenticated, token not found" }
      401 {"error":"Unauthenticated, invalid userId" }
      401 {"error":"Unauthenticated, invalid token" }
      401 {"error":"Unauthenticated, user not found"}
      500 {"error":"Intenal server error"}