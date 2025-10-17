# 🔄 WIZARD STEP 2 - COMPLETE REWRITE PLAN

## 📋 **CURRENT ISSUE:**
- Missing subcategories selection UI
- Not matching web app's expandable card design
- Need to show all subcategories with checkboxes and price inputs

## ✅ **WEB APP DESIGN:**
1. Service categories displayed as expandable cards with checkboxes
2. Click category → Expands to show ALL subcategories
3. Each subcategory has a checkbox + price input field
4. Can select individual subcategories (not forced to select all)
5. Visual feedback: Selected services show checkmark
6. Must select at least one category with at least one subcategory

## 🚀 **NEW MOBILE UI (Matching Web App):**

### **Layout:**
```
Experience Dropdown
↓
Services Offered Section
↓
[ √ Electricians ] ▼ (Expandable)
  ├─ [ ] Fan Installation/Repair      ₹ [500]
  ├─ [ ] AC Installation/Repair        ₹ [800]
  ├─ [ ] Geyser Installation/Repair    ₹ [600]
  └─ ...more subcategories
  
[ ] Plumbers ▼ (Collapsed)

[ ] Cleaners ▼ (Collapsed)

...etc
```

### **Features:**
- ✅ Checkbox on category (auto-select if any subcategory selected)
- ✅ Expand/collapse to show subcategories
- ✅ Individual subcategory selection
- ✅ Price input for each subcategory
- ✅ Default price: ₹500
- ✅ Visual indicators (blue border when selected)

---

## 📝 **IMPLEMENTATION:**
Rewriting `getWizardStep2()` with:
1. Experience dropdown (same)
2. Expandable service categories
3. Subcategory checkboxes with price inputs
4. Proper state management in `wizardData.step2.services`

Format:
```javascript
wizardData.step2.services = [
  {
    category: 'Electricians',
    subcategories: [
      { name: 'Fan Installation/Repair', price: 500, selected: true },
      { name: 'AC Installation/Repair', price: 800, selected: true },
      ...
    ]
  }
]
```

