import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getGame = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query('games')
      .withIndex('by_date', (q) => q.eq('date', args.date))
      .first();
    return game;
  },
});

export const getFoundWords = query({
  args: { playerId: v.string(), gameId: v.id('games') },
  handler: async (ctx, args) => {
    return  await ctx.db
      .query('foundWords')
      .withIndex('by_player_and_date', (q) =>
        q.eq('playerId', args.playerId).eq('gameId', args.gameId),
      )
      .collect();
  },
});

/**
 * Submit a word for validation
 * Mutation that accepts a word, player id and a game id
 * Checks if word is valid and adds it to user's found words
 */
export const submitWord = mutation({
  args: {
    word: v.string(),
    playerId: v.string(),
    gameId: v.id('games'),
  },
  handler: async (ctx, args) => {
    // Normalize word
    const normalizedWord = args.word.toLowerCase().trim();

    // Check if word is in gameWords table (valid words for this game)
    const gameWords = await ctx.db
      .query('gameWords')
      .withIndex('by_gameId', (q) => q.eq('gameId', args.gameId))
      .first();

    console.log("gameWords");
    console.log(gameWords.validWords);
    console.log(normalizedWord);
    console.log("gameWords");
    if (
      !gameWords ||  !gameWords.validWords.includes(normalizedWord)
    ) {
      return {
        valid: false,
        word: normalizedWord,
        error: 'INVALID_WORD',
        message: 'Not a valid word!',
      };
    }

    // Check if user already found this word
    const existingWord = await ctx.db
      .query('foundWords')
      .withIndex('by_player_date_word', (q) =>
        q.eq('playerId', args.playerId)
         .eq('gameId', args.gameId)
         .eq('word', normalizedWord)
      )
      .first();

    if (existingWord) {
      return {
        valid: false,
        word: normalizedWord,
        error: 'ALREADY_FOUND',
        message: 'You already found this word!',
      };
    }

    // Add word to user's found words
    await ctx.db.insert('foundWords', {
      playerId: args.playerId,
      gameId: args.gameId,
      word: normalizedWord,
    });

    // Get updated list of found words
    const foundWords = await ctx.db
      .query('foundWords')
      .withIndex('by_player_and_date', (q) =>
        q.eq('playerId', args.playerId).eq('gameId', args.gameId)
      )
      .collect();

    const foundWordsList = foundWords.map(fw => fw.word);

    return {
      valid: true,
      word: normalizedWord,
      message: 'Word accepted!',
      foundWords: foundWordsList,
    };
  },
});