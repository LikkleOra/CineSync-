// Direct seed script with hardcoded movies to bypass network issues
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase configuration');
    process.exit(1);
}

if (!geminiKey) {
    console.error('❌ Missing Gemini API key (GEMINI_API_KEY)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const genAI = new GoogleGenerativeAI(geminiKey);

// Hardcoded popular movies data
const movies = [
    { id: 278, title: "The Shawshank Redemption", overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an arbitrary warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates.", genres: ["Drama", "Crime"], poster_url: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg", release_date: "1994-09-23", popularity: 120.0, vote_average: 8.7 },
    { id: 238, title: "The Godfather", overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.", genres: ["Drama", "Crime"], poster_url: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", release_date: "1972-03-14", popularity: 100.0, vote_average: 8.7 },
    { id: 240, title: "The Godfather Part II", overview: "The continuing saga of the Corleone crime family tells the story of a young Vito Corleone growing up in Sicily and in 1910s New York and follows Michael Corleone as he expands the family crime empire.", genres: ["Drama", "Crime"], poster_url: "https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg", release_date: "1974-12-20", popularity: 65.0, vote_average: 8.6 },
    { id: 424, title: "Schindler's List", overview: "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory.", genres: ["Drama", "History", "War"], poster_url: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", release_date: "1993-12-15", popularity: 55.0, vote_average: 8.6 },
    { id: 129, title: "Spirited Away", overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.", genres: ["Animation", "Family", "Fantasy"], poster_url: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", release_date: "2001-07-20", popularity: 80.0, vote_average: 8.5 },
    { id: 19404, title: "Dilwale Dulhania Le Jayenge", overview: "Raj is a rich, carefree, happy-go-lucky second generation NRI. Simran is the daughter of Chaudhary Baldev Singh, who in spite of being an NRI is very conservative. Simran has left for India to be married to her childhood fiancé.", genres: ["Comedy", "Drama", "Romance"], poster_url: "https://image.tmdb.org/t/p/w500/lfRkUr7DYdHldAqi3PwdQGBRBPM.jpg", release_date: "1995-10-20", popularity: 30.0, vote_average: 8.5 },
    { id: 389, title: "12 Angry Men", overview: "The defense and the prosecution have rested and the jury is filing into the jury room. Twelve men must decide the fate of a young boy accused of murder.", genres: ["Drama"], poster_url: "https://image.tmdb.org/t/p/w500/ppd84D2i9W8jXmsyInGyihiSyqz.jpg", release_date: "1957-04-10", popularity: 35.0, vote_average: 8.5 },
    { id: 155, title: "The Dark Knight", overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.", genres: ["Drama", "Action", "Crime", "Thriller"], poster_url: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", release_date: "2008-07-16", popularity: 85.0, vote_average: 8.5 },
    { id: 497, title: "The Green Mile", overview: "A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people's ailments.", genres: ["Fantasy", "Drama", "Crime"], poster_url: "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg", release_date: "1999-12-10", popularity: 50.0, vote_average: 8.5 },
    { id: 680, title: "Pulp Fiction", overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.", genres: ["Thriller", "Crime"], poster_url: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", release_date: "1994-09-10", popularity: 75.0, vote_average: 8.5 },
    { id: 122, title: "The Lord of the Rings: The Return of the King", overview: "Aragorn is revealed as the heir to the ancient kings as he and Gandalf lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.", genres: ["Adventure", "Fantasy", "Action"], poster_url: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", release_date: "2003-12-01", popularity: 90.0, vote_average: 8.5 },
    { id: 13, title: "Forrest Gump", overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.", genres: ["Comedy", "Drama", "Romance"], poster_url: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", release_date: "1994-06-23", popularity: 70.0, vote_average: 8.5 },
    { id: 27205, title: "Inception", overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception.", genres: ["Action", "Science Fiction", "Adventure"], poster_url: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", release_date: "2010-07-15", popularity: 95.0, vote_average: 8.4 },
    { id: 550, title: "Fight Club", overview: "A depressed man suffering from insomnia meets a strange soap salesman named Tyler Durden and soon finds himself in an underground fight club that evolves into something much, much more.", genres: ["Drama"], poster_url: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", release_date: "1999-10-15", popularity: 65.0, vote_average: 8.4 },
    { id: 372058, title: "Your Name", overview: "High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places.", genres: ["Animation", "Romance", "Drama"], poster_url: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg", release_date: "2016-08-26", popularity: 60.0, vote_average: 8.5 },
    { id: 120, title: "The Lord of the Rings: The Fellowship of the Ring", overview: "Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home to keep it from falling into the hands of its evil creator.", genres: ["Adventure", "Fantasy", "Action"], poster_url: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", release_date: "2001-12-18", popularity: 85.0, vote_average: 8.4 },
    { id: 244786, title: "Whiplash", overview: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.", genres: ["Drama", "Music"], poster_url: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg", release_date: "2014-10-10", popularity: 50.0, vote_average: 8.4 },
    { id: 603, title: "The Matrix", overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.", genres: ["Action", "Science Fiction"], poster_url: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", release_date: "1999-03-30", popularity: 80.0, vote_average: 8.2 },
    { id: 157336, title: "Interstellar", overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.", genres: ["Adventure", "Drama", "Science Fiction"], poster_url: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", release_date: "2014-11-05", popularity: 90.0, vote_average: 8.4 },
    { id: 637, title: "Life Is Beautiful", overview: "A touching story of an Italian book seller who must employ his imagination to shield his Jewish son from the horrors of a Nazi death camp.", genres: ["Comedy", "Drama"], poster_url: "https://image.tmdb.org/t/p/w500/74hLDKjD5aGYOotO6esUVaeISa2.jpg", release_date: "1997-12-20", popularity: 40.0, vote_average: 8.5 }
];

async function generateEmbedding(text) {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

async function seedMovies() {
    console.log('🎬 Starting movie database seed with Gemini embeddings...\n');
    console.log(`📥 Processing ${movies.length} movies...\n`);

    const moviesWithEmbeddings = [];

    for (const movie of movies) {
        try {
            console.log(`🔄 Generating embedding for: ${movie.title}`);
            const embedding = await generateEmbedding(movie.overview);
            moviesWithEmbeddings.push({ ...movie, embedding });
            console.log(`   ✅ Done (${embedding.length} dimensions)`);
        } catch (error) {
            console.warn(`   ⚠️ Failed: ${error.message}`);
        }
        // Rate limit delay
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n✅ Generated embeddings for ${moviesWithEmbeddings.length}/${movies.length} movies\n`);

    if (moviesWithEmbeddings.length === 0) {
        console.error('❌ No movies with embeddings. Aborting.');
        process.exit(1);
    }

    // Clear existing data and insert
    console.log('🗑️  Clearing existing movies...');
    await supabase.from('movies').delete().neq('id', 0);

    console.log('💾 Inserting movies into Supabase...');
    const { error, data } = await supabase
        .from('movies')
        .insert(moviesWithEmbeddings)
        .select();

    if (error) {
        console.error('❌ Supabase insert error:', error);
        process.exit(1);
    }

    console.log(`\n✅ Successfully inserted ${data?.length || 0} movies!`);
    console.log('🎉 Seed complete!');
}

seedMovies().catch(console.error);
