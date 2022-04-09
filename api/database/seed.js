const { createPool, sql } = require('slonik')


const gameUuids = [
    '3d907a0e-8793-4061-b170-353f885e6e10',
    'e00a250f-8155-47b8-bf8b-61dc193784d0',
    'e2f192f1-3e5d-43d2-8f84-c133d799a9a5'
]
const initials = ['glc', 'jss', 'cak', 'erb']
const scoresForInsert = [443656, 358246, 838559, 454114, 247629, 719800, 662903, 103299, 865354, 294080]
const scoreUuids = [
    '98b72df5-d470-45c5-a011-02444e159a07',
    '19104ce6-5955-43df-ac8a-9f80e0e0fe24',
    '4b458f33-8329-48c0-a960-e44192c2a28e',
    'ccdd41ee-1d69-4023-b6ff-53134ea2265f',
    '8bbc0912-cff4-4ed8-9e87-8ce3165bc797',
    '34c8ea93-247a-4497-9bc9-dcc978a76b50',
    'ae8f163b-9efd-4671-8ead-8db7347e5c08',
    'e14f3788-3c21-4631-820f-05362a8d82b7',
    '1be0a6e0-4a2d-438f-8f31-926248e08694',
    'a0124c0d-089b-488a-809a-2685a1af1235'
]

const date = new Date().toISOString()

const CONNECTION_STRING = process.env.NODE_ENV === 'TEST'
    ? process.env.TEST_POSTGRES_CONNECTION_STRING
    : process.env.POSTGRES_CONNECTION_STRING

async function seedAllData() {
    const slonik = createPool(CONNECTION_STRING)
    try {
        await slonik.query(sql`
            DELETE FROM scores;
            DELETE FROM games;
        `)

        // We need to split this up from the DELETE commands because when using parameters with Postgres,
        // We can only run a single query https://github.com/lib/pq/issues/928#issuecomment-575254724
        await slonik.query(sql`
            INSERT INTO
                games (id, description, is_deleted, slug, title, created_at)
            VALUES
                (${gameUuids[0]}, 'A Costanza classic', FALSE, 'frogger', 'Frogger', ${date}::timestamptz),
                (${gameUuids[1]}, 'Where''s Will Smith when you need him?', FALSE, 'attack-from-mars', 'Attack from Mars', ${date}::timestamptz),
                (${gameUuids[2]}, 'Peter Pickle the jerk', FALSE, 'burger-time', 'Burger Time', ${date}::timestamptz);
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
                    scores (id, game, initials, is_deleted, score, created_at)
                VALUES
                    (${scoreUuids[i]}, ${gameFK}, ${initialsForInsert}, FALSE, ${scoresForInsert[i]}, ${date}::timestamptz);
            `)
        }
    } catch (err) {
        console.log('Slippery Pete needs help!', err)
    } finally {
        await slonik.end();
    }
}

seedAllData()
