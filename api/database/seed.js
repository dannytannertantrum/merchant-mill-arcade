const { createPool, sql } = require('slonik')


const initials = ['glc', 'jss', 'cak', 'erb']

async function seedAllData() {
    const slonik = createPool(process.env.POSTGRES_CONNECTION_STRING)
    try {
        await slonik.query(sql`
            DELETE FROM scores;
            DELETE FROM games;
            INSERT INTO
                games (description, title, slug)
            VALUES
                ('A Costanza classic', 'Frogger', 'frogger'),
                ('Where''s Will Smith when you need him?', 'Attack from Mars', 'attack-from-mars'),
                ('Peter Pickle the jerk', 'Burger Time', 'burger-time')
        `)

        const gameData = await slonik.query(sql`
            SELECT id from games
        `)

        const gameIds = gameData.rows.map(row => row.id)

        for (let i = 0; i < 10; i++) {
            const gameFK = gameIds[i % gameIds.length]
            const randomInitials = initials[i % initials.length]
            const randomScore = Math.floor(Math.random() * 1000000)

            await slonik.query(sql`
                INSERT INTO
                    scores (game, initials, score)
                VALUES (${gameFK}, ${randomInitials}, ${randomScore})
            `)
        }
    } catch (err) {
        console.log('Slippery Pete needs help!', err)
    } finally {
        await slonik.end();
    }
}

seedAllData()
