import React, { Fragment } from 'react'
import { MongoClient } from "mongodb"
import Head from 'next/head'

import MeetupList from "../components/meetups/MeetupList"


const DUMMY_MEETUPS = [{
    id: "1",
    title: "Lorem Ipsum",
    image: "https://dummyimage.com/600x300/000/fff",
    address: "What is Lorem Ipsum?",
    decription: "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
}, {
    id: "2",
    title: "Lorem Ipsum 2",
    image: "https://dummyimage.com/600x300/000/ff000",
    address: "What is Lorem Ipsum 2?",
    decription: "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
}]

function HomePage(props) {
    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta name="description" content='description'/>    
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    )
}

// export async function getServerSideProps(context) { // run every request, use if data changes for multiple times/frequesntly
//     const req = context.req
//     const res = context.res

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

export async function getStaticProps() {
    // fetch data, read data from files, system from SERVER side
    const client = await MongoClient.connect(`mongodb+srv://${process.env.MONGO_CLIENT}:${process.env.MONGO_PASSWORD}@cluster0.g0fnd.mongodb.net/myPersonalData?retryWrites=true&w=majority`)
    const db = client.db()

    const meetupsCollection = db.collection('myPersonalData')

    const meetups = await meetupsCollection.find().toArray()

    client.close()

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                description: meetup.description,
                id: meetup._id.toString()
            }))
        },
        // increment static generation
        revalidate: 1 //will be revalidate every 10s if there is request
    }
}

export default HomePage
