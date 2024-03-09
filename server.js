import express from 'express'
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
import { URLSearchParams } from 'url'

const app = express()


app.get('/initiate', (req, res) => {
    const options = {
        redirectUri: 'https://google.com',
        clientId: process.env.CLIENT_ID,
        baseUrl: process.env.BASE_URL
    }

    return res.redirect(`${options.baseUrl}/oauth/chooselocation?response_type=code&redirect_uri=${options.redirectUri}&client_id=${options.clientId}&scope=contacts.write contacts.readonly`)
})


app.get('/getAccessToken', async (req, res) => {
    let code = req.query.code

    const encodedParams = new URLSearchParams();
    encodedParams.set('client_id', process.env.CLIENT_ID);
    encodedParams.set('client_secret', process.env.CLIENT_SECRET);
    encodedParams.set('grant_type', 'authorization_code');
    encodedParams.set('code', code);
    encodedParams.set('user_type', 'Location');

    const options = {
        method: 'POST',
        url: 'https://services.leadconnectorhq.com/oauth/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
        },
        data: encodedParams,
    };

    try {
        const { data } = await axios.request(options);
        console.log(data);
        res.status(200).json(data)
    } catch (error) {
        console.error(error);
    }
})

app.put('/updateContact', async (req, res) => {
    try {

        const { accessToken, location } = req.query

        //get all contacts
        // const options = {
        //     method: 'GET',
        //     url: 'https://services.leadconnectorhq.com/contacts/',
        //     params: { locationId: location },
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`,
        //         Version: '2021-07-28',
        //         Accept: 'application/json'
        //     }
        // };

        // const { data } = await axios.request(options);
        // console.log(data)
        // res.json(data)

        // const contactFound = data.contacts.filter((contact) =>
        //     contact.customFields.some((field) => field.value.length > 0)
        // );

        // let contactDetails = contactFound[0]
        // // contactDetails.customFields[0].value = "TES"
        // // delete contactDetails.id

        // console.log(contactDetails)

        // for updating the contact
        const optionsForUpdation = {
            method: 'PUT',
            url: `https://services.leadconnectorhq.com/contacts/L8p81677ltbSPOMnCuFy`,
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Version: '2021-07-28',
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            data: {
                customFields: [
                    {
                        id: "L5JN3pehxg7yK6VES0lY",
                        value: "TEST"
                    }
                ]
            }
          };


        const updatedDetails = await axios.request(optionsForUpdation);
        console.log("updated",updatedDetails.data);
        res.status(200).json(updatedDetails.data)



    } catch (error) {
        console.error(error);
    }
})


app.listen(3000, (req, res) => {
    console.log('server connected')
})