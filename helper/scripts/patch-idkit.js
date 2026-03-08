const fs = require('fs');

// 1. Patch @worldcoin/idkit package.json for exports
const pkgPath = './node_modules/@worldcoin/idkit/package.json';
try {
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

        if (!pkg.exports['.']) pkg.exports['.'] = {};
        pkg.exports['.'].require = './build/index.js';
        pkg.exports['.'].default = './build/index.js';

        if (pkg.exports['./internal']) {
            pkg.exports['./internal'].require = './build/internal.js';
            pkg.exports['./internal'].default = './build/internal.js';
        }

        if (pkg.exports['./signing']) {
            pkg.exports['./signing'].require = './build/signing.js';
            pkg.exports['./signing'].default = './build/signing.js';
        }

        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        console.log('✅ Successfully patched @worldcoin/idkit exports');
    }
} catch (error) {
    console.error('❌ Failed to patch @worldcoin/idkit:', error);
}

// 2. Patch @worldcoin/idkit-core for environment detection
const corePaths = [
    './node_modules/@worldcoin/idkit-core/dist/index.js',
    './node_modules/@worldcoin/idkit-core/dist/index.cjs'
];

corePaths.forEach(filePath => {
    try {
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');

            // Pattern to inject environment inference after function/method signature
            // Matches: function name(..., environment) {  OR  static name(..., environment) {
            const pattern = /(function|static) (request|createSession|proveSession|forCreateSession|forProveSession|constructor)\(([^)]*), environment\) \{/g;
            const replacement = '$1 $2($3, environment) {\n  if ((environment === undefined || environment === null) && app_id.startsWith("app_staging_")) {\n    environment = "staging";\n  }';

            if (!content.includes('app_id.startsWith("app_staging_")')) {
                content = content.replace(pattern, replacement);
                fs.writeFileSync(filePath, content);
                console.log(`✅ Successfully patched ${filePath} for environment detection`);
            } else {
                // If already partially patched, we might need to re-patch if the regex was limited
                // For safety, let's just force update if it doesn't match our new broad pattern
                const newContent = content.replace(pattern, replacement);
                if (newContent !== content) {
                    fs.writeFileSync(filePath, newContent);
                    console.log(`✅ Successfully updated patch for ${filePath}`);
                } else {
                    console.log(`ℹ️ ${filePath} already fully patched for environment detection`);
                }
            }
        }
    } catch (error) {
        console.error(`❌ Failed to patch ${filePath}:`, error);
    }
});
