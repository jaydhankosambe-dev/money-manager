// ============================================
// CHANGES FOR ChartsScreen.js
// ============================================

// INCREASE ALL FONT SIZES BY 2

// Strategy: Find all fontSize properties and add 2 to each value

// Example changes:
// fontSize: 12  →  fontSize: 14
// fontSize: 14  →  fontSize: 16
// fontSize: 16  →  fontSize: 18
// fontSize: 18  →  fontSize: 20
// fontSize: FONTS.small  →  fontSize: FONTS.small + 2
// fontSize: FONTS.medium  →  fontSize: FONTS.medium + 2
// fontSize: FONTS.large  →  fontSize: FONTS.large + 2

// Common locations to check:
// 1. Chart labels and titles
// 2. Data table text
// 3. Header text
// 4. Legend text
// 5. Axis labels

// Search for all instances of "fontSize:" and increase the value by 2

// Example specific changes:
// In chart configuration:
labelStyle: {
  fontSize: 12,  // Change to 14
}

// In table cells:
cellTextStyle: {
  fontSize: 14,  // Change to 16
}

// In titles:
titleStyle: {
  fontSize: 18,  // Change to 20
}

// In axis labels:
axisLabelStyle: {
  fontSize: 12,  // Change to 14
}
