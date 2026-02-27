const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

async function runFix() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    console.log('📄 Reading complete-fix.sql...');
    const sql = fs.readFileSync('complete-fix.sql', 'utf8');
    
    console.log('🔧 Executing complete fix...');
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ Complete fix executed successfully!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runFix();