package com.focusbridge.di

import android.content.Context
import androidx.room.Room
import com.focusbridge.data.AppDatabase
import com.focusbridge.data.TimetableDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "focus_bridge_db"
        ).build()
    }

    @Provides
    @Singleton
    fun provideTimetableDao(database: AppDatabase): TimetableDao {
        return database.timetableDao()
    }
}