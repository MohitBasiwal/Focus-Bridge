package com.focusbridge.domain.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "timetables")
data class TimetableEntity(
    @PrimaryKey val id: String,
    val title: String,
    val subject: String,
    val startTime: String,
    val endTime: String,
    val focusModeEnabled: Boolean
)\n