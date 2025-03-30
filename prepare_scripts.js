const fs = require('fs');
const path = require('path');

console.log("preparing scripts...");

const list_files_recursively = (folder_path) => {
   const results = [];

   const traverse = (current_path) => {
      const files = fs.readdirSync(current_path);

      for (const file of files) {
         const absolute_path = path.join(current_path, file);
         const stat = fs.statSync(absolute_path);

         if (stat.isDirectory()) {
            traverse(absolute_path); // Recursive call for subdirectories
         } else {
            const not_win_path = absolute_path.replaceAll('\\', '/');
            const not_with_extension = not_win_path.replaceAll('.fs', '');
            const removed_base_path = not_with_extension.replaceAll('src/script/', '');
            results.push(removed_base_path);
         }
      }
   }

   traverse(folder_path);
   return results;
}

function writeStringsToJson(filePath, stringList) {
   try {
      const jsonData = JSON.stringify(stringList, null, 2); // Convert array to JSON string
      fs.writeFileSync(filePath, jsonData); // Write to file
      console.log(`Successfully wrote to ${filePath}`);
   } catch (error) {
      console.error(`Error writing to ${filePath}:`, error);
   }
}

const allFiles = list_files_recursively('./src/script');
console.log(allFiles);

writeStringsToJson('./src/all_scripts.json', allFiles);

