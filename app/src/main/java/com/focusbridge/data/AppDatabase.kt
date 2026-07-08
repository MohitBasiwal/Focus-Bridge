package com.focusbridge.data

import androidx.room.Database
import androidx.room.RoomDatabase
import com.focusbridge.domain.model.TimetableEntity

@Database(entities = [TimetableEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun timetableDao(): TimetableDao
}