const { createPool, sql } = require('slonik')
const { readFile } = require('fs/promises')
const path = require('path')


const gamesCSV = path.join(__dirname, './seedDataGames.csv')
const scoresCSV = path.join(__dirname, './seedDataScores.csv')

const extractCSVData = async (filePath) => {
    const data = await readFile(filePath, { encoding: 'utf-8' })

    // We can ignore the first line, which is simply the header
    const rawData = data.split(/\r?\n/).splice(1)

    const dateCheckRegex = /[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/

    const formattedForInsert = rawData.map(val => {
        const formatEntires = val.split(',').map(val => {
            if (val === '') return null
            if (dateCheckRegex.test(val)) return new Date(val).toISOString()
            if (val === 't') return true
            if (val === 'f') return false
            return val
        })
        return formatEntires
    })

    return formattedForInsert
}

const CONNECTION_STRING = process.env.NODE_ENV_TEST === 'TEST'
    ? process.env.TEST_POSTGRES_CONNECTION_STRING
    : process.env.POSTGRES_CONNECTION_STRING

async function seedAllData() {
    const slonik = createPool(CONNECTION_STRING)

    const gameData = await extractCSVData(gamesCSV)
    const scoreData = await extractCSVData(scoresCSV)

    try {
        await slonik.query(sql`
            DELETE FROM scores;
            DELETE FROM games;
        `)

        // We need to split this up from the DELETE commands because when using parameters with Postgres,
        // We can only run a single query https://github.com/lib/pq/issues/928#issuecomment-575254724
        for (let i = 0; i < gameData.length; i++) {
            await slonik.query(sql`
                INSERT INTO
                    games (id, description, image_url, is_deleted, slug, title, created_at, updated_at)
                VALUES (
                    ${gameData[i][0]},
                    ${gameData[i][1]},
                    ${gameData[i][2]},
                    ${gameData[i][3]},
                    ${gameData[i][4]},
                    ${gameData[i][5]},
                    ${gameData[i][6]}::timestamptz,
                    ${gameData[i][7]}::timestamptz
                );
            `)
        }

        for (let i = 0; i < scoreData.length; i++) {
            await slonik.query(sql`
                INSERT INTO
                    scores (id, game_id, initials, is_deleted, score, created_at, updated_at)
                VALUES (
                    ${scoreData[i][0]},
                    ${scoreData[i][1]},
                    ${scoreData[i][2]},
                    ${scoreData[i][3]},
                    ${scoreData[i][4]},
                    ${scoreData[i][5]}::timestamptz,
                    ${scoreData[i][6]}::timestamptz
                );
            `)
        }

    } catch (reason) {
        console.log('Slippery Pete needs help!', reason)
    } finally {
        await slonik.end();
    }
}

seedAllData()
