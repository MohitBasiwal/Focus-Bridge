package com.focusbridge.service

import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityEvent

class FocusAccessibilityService : AccessibilityService() {
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        
        val packageName = event.packageName?.toString() ?: return
        val className = event.className?.toString() ?: ""
        
        Log.d("FocusAccessibility", "App opened: $packageName, Class: $className")
    }

    override fun onInterrupt() {
        Log.e("FocusAccessibility", "Service Interrupted")
    }
    
    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d("FocusAccessibility", "Service Connected")
    }
}