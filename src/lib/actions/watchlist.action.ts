'use server';

import { connectToDatabase } from '../../../database/mongoose';
import { Watchlist } from '../../../database/watchlist.model';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; 
      id?: string;
       email?: string }>({ email });
    if (!user) return [];
    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean(); //{symbol:1 is called projection}
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function getWatchlistStatusByUserId(userId: string, symbol: string): Promise<boolean> {
  if (!userId || !symbol) return false;

  try {
    await connectToDatabase();
    const normalizedSymbol = symbol.toUpperCase().trim();
    const item = await Watchlist.findOne({ userId, symbol: normalizedSymbol }).lean();
    return Boolean(item);
  } catch (err) {
    console.error('getWatchlistStatusByUserId error:', err);
    return false;
  }
}

export async function getWatchlistByUserId(userId: string) {
  if (!userId) return [];

  try {
    await connectToDatabase();
    return await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
  } catch (err) {
    console.error('getWatchlistByUserId error:', err);
    return [];
  }
}

export async function updateWatchlistAlertByUserId(userId: string, symbol: string, alertThreshold: number | null): Promise<boolean> {

  console.log(' updateWatchlistAlertByUserId called with:', { userId, symbol, alertThreshold });
  if (!userId || !symbol) return false;

  try {
    await connectToDatabase();
    const normalizedSymbol = symbol.toUpperCase().trim();

    type UpdatePayload = {
      $set: {
        userId: string;
        symbol: string;
        alertThreshold?: number;
      };
      $unset?: {
        alertThreshold: '';
      };
    };

    const update: UpdatePayload = {
      $set: { userId, symbol: normalizedSymbol },
    };

    if (alertThreshold === null) {
      update.$unset = { alertThreshold: '' };
    } else {
      update.$set.alertThreshold = alertThreshold;
    }

    const result = await Watchlist.updateOne({ userId, symbol: normalizedSymbol }, update);
    return result.modifiedCount > 0 || result.upsertedCount > 0;
  } catch (err) {
    console.error('updateWatchlistAlertByUserId error:', err);
    return false;
  }
}

export async function addToWatchlistByUserId(userId: string, symbol: string, company: string, alertThreshold?: number): Promise<boolean> {
  if (!userId || !symbol || !company) return false;

  try {
    await connectToDatabase();
    const normalizedSymbol = symbol.toUpperCase().trim();
    const normalizedCompany = company.trim();

    type AddUpdatePayload = {
      $set: {
        userId: string;
        symbol: string;
        company: string;
        addedAt: Date;
        alertThreshold?: number;
      };
    };

    const update: AddUpdatePayload = {
      $set: {
        userId,
        symbol: normalizedSymbol,
        company: normalizedCompany,
        addedAt: new Date(),
      },
    };

    if (typeof alertThreshold === 'number') {
      update.$set.alertThreshold = alertThreshold;
    }

    await Watchlist.updateOne(
      { userId, symbol: normalizedSymbol },
      update,
      { upsert: true }
    );

    return true;
  } catch (err) {
    console.error('addToWatchlistByUserId error:', err);
    return false;
  }
}

export async function removeFromWatchlistByUserId(userId: string, symbol: string): Promise<boolean> {
  if (!userId || !symbol) return false;

  try {
    await connectToDatabase();
    const normalizedSymbol = symbol.toUpperCase().trim();
    const result = await Watchlist.deleteOne({ userId, symbol: normalizedSymbol });
    return result.deletedCount > 0;
  } catch (err) {
    console.error('removeFromWatchlistByUserId error:', err);
    return false;
  }
}
