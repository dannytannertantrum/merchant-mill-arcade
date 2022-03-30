const { createPool, sql } = require('slonik')


const initials = ['glc', 'jss', 'cak', 'erb']
const scoresForInsert = [443656, 358246, 838559, 454114, 247629, 719800, 662903, 103299, 865354, 294080]
const CONNECTION_STRING = process.env.NODE_ENV === 'TEST'
    ? process.env.TEST_POSTGRES_CONNECTION_STRING
    : process.env.POSTGRES_CONNECTION_STRING

async function seedAllData() {
    const slonik = createPool(CONNECTION_STRING)
    try {
        await slonik.query(sql`
            DELETE FROM scores;
            DELETE FROM games;
            INSERT INTO
                games (id, description, title, slug)
            VALUES
                ('3d907a0e-8793-4061-b170-353f885e6e10', 'A Costanza classic', 'Frogger', 'frogger'),
                ('e00a250f-8155-47b8-bf8b-61dc193784d0', 'Where''s Will Smith when you need him?', 'Attack from Mars', 'attack-from-mars'),
                ('e2f192f1-3e5d-43d2-8f84-c133d799a9a5', 'Peter Pickle the jerk', 'Burger Time', 'burger-time')
        `)

        const gameData = await slonik.query(sql`
            SELECT id from games
        `)

        const gameIds = gameData.rows.map(row => row.id)

        for (let i = 0; i < 10; i++) {
            const gameFK = gameIds[i % gameIds.length]
            const initialsForInsert = initials[i % initials.length]

            await slonik.query(sql`
                INSERT INTO
                    scores (game, initials, score)
                VALUES (${gameFK}, ${initialsForInsert}, ${scoresForInsert[i]})
            `)
        }
    } catch (err) {
        console.log('Slippery Pete needs help!', err)
    } finally {
        await slonik.end();
    }
}

seedAllData()
