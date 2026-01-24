  Code Review: todotxt-mode VS Code Extension                                                                           
                                                                                                                        
           
  3. Synchronous File Operations Block Extension Host                                                                   
                                                                                                                        
  Problem in files.ts: Uses synchronous Node.js file operations:                                                        
  - fs.readFileSync() (extension.ts:48, extension.ts:91)                                                                
  - fs.appendFileSync() (files.ts:28, files.ts:53)                                                                      
  - fs.existsSync() (files.ts:74, files.ts:191)                                                                         
                                                                                                                        
  These block the VS Code extension host thread.                                                                        
                                                                                                                        
  Recommendation: Use VS Code's async workspace filesystem API:                                                         
  import { workspace, Uri } from 'vscode';                                                                              
                                                                                                                        
  // Instead of fs.readFileSync                                                                                         
  const content = await workspace.fs.readFile(Uri.file(notePath));                                                      
  const text = new TextDecoder().decode(content);                                                                       
                                                                                                                        
  // Instead of fs.appendFileSync                                                                                       
  const encoder = new TextEncoder();                                                                                    
  await workspace.fs.writeFile(uri, encoder.encode(existingContent + newContent));                                      
                                                                                                                        
  ---                                                                                                                   
  4. Decoration Types Not Disposed                                                                                      
                                                                                                                        
  Problem in decorations.ts: TextEditorDecorationType instances are created in constructors but never disposed, causing 
  memory leaks:                                                                                                         
  - decorations.ts:43 - createTextEditorDecorationType()                                                                
  - decorations.ts:78-80 - multiple types in PriorityDecoration                                                         
  - decorations.ts:127-129 - three types in DateDecoration                                                              
                                                                                                                        
  Recommendation: Store decoration types and dispose them in deactivate():                                              
  // In extension.ts                                                                                                    
  let decorator: Decorator;                                                                                             
                                                                                                                        
  export function activate(context: vscode.ExtensionContext) {                                                          
      decorator = new Decorator();                                                                                      
      context.subscriptions.push({ dispose: () => decorator.dispose() });                                               
  }                                                                                                                     
                                                                                                                        
  // In Decorator class                                                                                                 
  dispose() {                                                                                                           
      this.decorations.forEach(d => d.decorationType?.dispose());                                                       
  }                                                                                                                     
                                                                                                                        
  ---                                                                                                                   
  5. Command Registration Pattern                                                                                       
                                                                                                                        
  Problem in commands.ts: Verbose registration with 16 separate variables that are all pushed individually.             
                                                                                                                        
  Recommendation: Use a more compact pattern:                                                                           
  const commands: [string, () => void][] = [                                                                            
      ['toggleCompletion', () => Completion.toggleCompletion()],                                                        
      ['sortByContext', () => Sorting.sortLinesByField("context")],                                                     
      // ...                                                                                                            
  ];                                                                                                                    
                                                                                                                        
  commands.forEach(([name, handler]) => {                                                                               
      context.subscriptions.push(                                                                                       
          vscode.commands.registerCommand(`extension.${name}`, handler)                                                 
      );                                                                                                                
  });                                                                                                                   
                                                                                                                        
  ---                                                                                                                   
  6. Duplicate Hover Providers                                                                                          
                                                                                                                        
  Problem in extension.ts:36-107: The note hover provider and project hover provider are nearly identical code.         
                                                                                                                        
  Recommendation: Extract a shared function:                                                                            
  function createFileHoverProvider(                                                                                     
      tagMatcher: (word: string) => boolean,                                                                            
      getFilename: (word: string) => string,                                                                            
      linkText: string                                                                                                  
  ): vscode.HoverProvider {                                                                                             
      return {                                                                                                          
          provideHover(document, position) {                                                                            
              // shared logic                                                                                           
          }                                                                                                             
      };                                                                                                                
  }                                                                                                                     
                                                                                                                        
  ---                                                                                                                   
  7. Namespace Pattern is Outdated                                                                                      
                                                                                                                        
  Problem: All modules use export namespace X { } pattern (Settings, Helpers, Files, Patterns, Sorting, Completion).    
                                                                                                                        
  This is a legacy TypeScript pattern. Modern TypeScript prefers ES module exports.                                     
                                                                                                                        
  Recommendation: Convert to regular exports:                                                                           
  // Instead of: export namespace Helpers { export function EOL() {...} }                                               
  // Use:                                                                                                               
  export function EOL() { ... }                                                                                         
  export function getSelectedLineRange() { ... }                                                                        
                                                                                                                        
  // Import as:                                                                                                         
  import * as Helpers from './helpers';                                                                                 
  // or                                                                                                                 
  import { EOL, getSelectedLineRange } from './helpers';                                                                
                                                                                                                        
  ---                                                                                                                   
  8. Selection Change Hack for Redecoration                                                                             
                                                                                                                        
  Problem in helpers.ts:116-123: triggerSelectionChange() artificially moves the selection to force redecoration. This  
  is called after every edit operation.                                                                                 
                                                                                                                        
  Recommendation: Call decorator.decorateDocument() directly instead of manipulating selection. Or use                  
  vscode.workspace.onDidChangeTextDocument to trigger redecoration.                                                     
                                                                                                                        
  ---                                                                                                                   
  9. Missing Null Checks                                                                                                
                                                                                                                        
  Problem: vscode.window.activeTextEditor is accessed without null checks throughout the codebase:                      
  - helpers.ts:11, helpers.ts:27                                                                                        
  - files.ts:61, files.ts:67                                                                                            
  - extension.ts:43, extension.ts:86                                                                                    
                                                                                                                        
  Recommendation: Add guards:                                                                                           
  const editor = vscode.window.activeTextEditor;                                                                        
  if (!editor) {                                                                                                        
      return;                                                                                                           
  }                                                                                                                     
                                                                                                                        
  ---                                                                                                                   
  10. Package.json Updates                                                                                              
                                                                                                                        
  Current: "vscode": "^1.77.0" - this is fine but somewhat old (April 2023).                                            
                                                                                                                        
  Recommendations:                                                                                                      
  - Consider bumping the minimum VS Code version to access newer APIs                                                   
  - The activationEvents could potentially be simplified if you target newer VS Code versions                           
  - Consider adding "extensionKind": ["workspace"] for better remote development support                                
                                                                                                                        
  ---                                                                                                                   
  Summary Priority List                                                                                                 
  ┌──────────┬───────────────────────────────────┬────────┐
  │ Priority │               Issue               │ Effort │
  ├──────────┼───────────────────────────────────┼────────┤
  │ Medium   │ Async file operations             │ Medium │
  ├──────────┼───────────────────────────────────┼────────┤
  │ Medium   │ Add null checks                   │ Low    │
  ├──────────┼───────────────────────────────────┼────────┤
  │ Low      │ Refactor namespaces to ES modules │ Medium │
  ├──────────┼───────────────────────────────────┼────────┤
  │ Low      │ Consolidate duplicate code        │ Low    │
  └──────────┴───────────────────────────────────┴────────┘