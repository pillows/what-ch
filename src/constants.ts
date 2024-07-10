export const cpp_code = `
#include <iostream>
int main()
{
    std::cout << "hello!! World\\n";
    return 0;
}`;

export const javascript_code = `console.log("Hello, World!");
console.log("Multi line test!");`;

export const php_code = `<?php echo "Hello, World!"; ?>`;

export const python_code = `import datetime

currentDT = datetime.datetime.now()
print (str(currentDT))
# My python code here
print("Hello from Python!")
`;

export const codeTemplates = {
  'c++': cpp_code,
  c_cpp: cpp_code,
  javascript: javascript_code,
  php: php_code,
  python: python_code,
  golang: ''
};

export const unavailable = ['golang'];

export const inputUnavailable = ['php', 'c_cpp', 'javascript'];
