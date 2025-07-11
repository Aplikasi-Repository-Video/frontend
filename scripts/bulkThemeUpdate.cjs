// scripts/bulkThemeUpdate.js
const fs = require('fs')
const path = require('path')

// Mapping dari hard coded classes ke theme classes
const themeReplacements = {
  // Background classes
  'bg-\\[#0f0b1d\\]': 'bg-primary',
  'bg-gray-800': 'bg-secondary',
  'bg-gray-900': 'bg-card',
  'bg-gray-700': 'bg-muted',
  'bg-black': 'bg-primary',
  'bg-slate-900': 'bg-primary',
  'bg-zinc-900': 'bg-primary',

  // Text classes
  'text-white': 'text-primary',
  'text-gray-300': 'text-secondary',
  'text-gray-400': 'text-muted',
  'text-gray-500': 'text-muted',
  'text-slate-300': 'text-secondary',
  'text-zinc-300': 'text-secondary',

  // Border classes
  'border-gray-700': 'border-primary',
  'border-gray-600': 'border-secondary',
  'border-gray-800': 'border-primary',
  'border-slate-700': 'border-primary',

  // Ring classes (for focus states)
  'ring-gray-700': 'ring-primary',
  'ring-gray-600': 'ring-secondary',

  // Divide classes
  'divide-gray-700': 'divide-primary',
  'divide-gray-600': 'divide-secondary',
}

// CSS classes yang akan ditambahkan
const customCSSClasses = `
/* Theme Classes - Tambahkan ke file CSS utama */
@layer components {
  .bg-primary {
    @apply bg-white dark:bg-[#0f0b1d];
  }

  .bg-secondary {
    @apply bg-gray-100 dark:bg-gray-800;
  }

  .bg-card {
    @apply bg-white dark:bg-gray-900;
  }

  .bg-muted {
    @apply bg-gray-50 dark:bg-gray-700;
  }

  .text-primary {
    @apply text-gray-900 dark:text-white;
  }

  .text-secondary {
    @apply text-gray-600 dark:text-gray-300;
  }

  .text-muted {
    @apply text-gray-500 dark:text-gray-400;
  }

  .border-primary {
    @apply border-gray-200 dark:border-gray-700;
  }

  .border-secondary {
    @apply border-gray-300 dark:border-gray-600;
  }

  .ring-primary {
    @apply ring-gray-200 dark:ring-gray-700;
  }

  .ring-secondary {
    @apply ring-gray-300 dark:ring-gray-600;
  }

  .divide-primary {
    @apply divide-gray-200 dark:divide-gray-700;
  }

  .divide-secondary {
    @apply divide-gray-300 dark:divide-gray-600;
  }
}
`

// Function untuk replace theme classes
const replaceThemeClasses = (content) => {
  let result = content

  Object.entries(themeReplacements).forEach(([oldClass, newClass]) => {
    const regex = new RegExp(oldClass, 'g')
    result = result.replace(regex, newClass)
  })

  return result
}

// Function untuk update Vue files
const updateVueFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const updatedContent = replaceThemeClasses(content)

    // Cek apakah ada perubahan
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent)
      return true
    }
    return false
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message)
    return false
  }
}

// Function untuk scan directory secara rekursif
const scanDirectory = (dirPath, fileExtensions = ['.vue']) => {
  const files = []

  const scanRecursive = (currentPath) => {
    try {
      const items = fs.readdirSync(currentPath)

      items.forEach(item => {
        const fullPath = path.join(currentPath, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          // Skip node_modules dan folder lainnya
          if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
            scanRecursive(fullPath)
          }
        } else if (fileExtensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath)
        }
      })
    } catch (error) {
      console.error(`Error scanning ${currentPath}:`, error.message)
    }
  }

  scanRecursive(dirPath)
  return files
}

// Function untuk backup files
const createBackup = (files) => {
  const backupDir = path.join(__dirname, '..', 'backup-theme-update')

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  console.log('Creating backup...')

  files.forEach(filePath => {
    const relativePath = path.relative(path.join(__dirname, '..'), filePath)
    const backupPath = path.join(backupDir, relativePath)
    const backupDirPath = path.dirname(backupPath)

    if (!fs.existsSync(backupDirPath)) {
      fs.mkdirSync(backupDirPath, { recursive: true })
    }

    fs.copyFileSync(filePath, backupPath)
  })

  console.log(`Backup created at: ${backupDir}`)
}

// Main function
const main = () => {
  console.log('🎨 Bulk Theme Updater Started...')

  // Directories to scan
  const directories = [
    './src/views',
    './src/pages',
    './src/components',
    './src/layouts',
    './src'
  ]

  // Collect all Vue files
  const allFiles = []
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = scanDirectory(dir)
      allFiles.push(...files)
      console.log(`Found ${files.length} files in ${dir}`)
    }
  })

  if (allFiles.length === 0) {
    console.log('No Vue files found!')
    return
  }

  console.log(`Total files to process: ${allFiles.length}`)

  // Create backup
  createBackup(allFiles)

  // Update files
  let updatedCount = 0
  console.log('\nUpdating files...')

  allFiles.forEach(filePath => {
    if (updateVueFile(filePath)) {
      updatedCount++
      console.log(`✅ Updated: ${filePath}`)
    } else {
      console.log(`⏭️  No changes: ${filePath}`)
    }
  })

  console.log(`\n🎉 Complete! Updated ${updatedCount} out of ${allFiles.length} files`)

  // Save custom CSS classes to file
  const cssPath = path.join(__dirname, '..', 'theme-classes.css')
  fs.writeFileSync(cssPath, customCSSClasses)
  console.log(`\n📝 Custom CSS classes saved to: ${cssPath}`)
  console.log('Copy these classes to your main CSS file (like src/assets/css/app.css)')

  console.log('\n📋 Next steps:')
  console.log('1. Copy theme-classes.css content to your main CSS file')
  console.log('2. Update your tailwind.config.js to enable dark mode')
  console.log('3. Add the useTheme composable to your project')
  console.log('4. Test the changes and restore from backup if needed')
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { replaceThemeClasses, updateVueFile, scanDirectory }
