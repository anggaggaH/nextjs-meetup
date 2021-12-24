import React, { Fragment } from 'react'
import { useRouter } from 'next/router'
import { MongoClient, ObjectId } from 'mongodb'
import Head from 'next/head'

import MeetUpDetail from '../../components/meetups/MeetupDetail'


function MeetupDetails(props) {
    const router = useRouter()

    console.log("props", props)
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name="description" content={props.meetupData.description}/>    
            </Head>
            <MeetUpDetail img={props.meetupData.image} title={props.meetupData.title} address={props.meetupData.address} description={props.meetupData.description} />
        </Fragment>
    )
}

export async function getStaticPaths() {
    const client = await MongoClient.connect('mongodb+srv://mawanboyz:c7uJBY4hKz4JT2dK@cluster0.g0fnd.mongodb.net/myPersonalData?retryWrites=true&w=majority')
    const db = client.db()

    const meetupsCollection = db.collection('myPersonalData')

    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()

    client.close()
    return {
        fallback: 'blocking',
        paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } }))
    }
}

export async function getStaticProps(context) {
    // fetch data, read data from files, system from SERVER side
    const meetupId = context.params.meetupId

    const client = await MongoClient.connect('mongodb+srv://mawanboyz:c7uJBY4hKz4JT2dK@cluster0.g0fnd.mongodb.net/myPersonalData?retryWrites=true&w=majority')
    const db = client.db()

    const meetupsCollection = db.collection('myPersonalData')

    const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)})

    console.log('selectedMeetup', selectedMeetup)
    client.close()

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description,
            }
        }
    }
}

export default MeetupDetails
