# Links
**Presentation** [Gareth-John-Presentation.pdf](./docs/Gareth-John-Presentation.pdf)

**Write up** 
[Gareth-John-Writeup.pdf](./docs/Gareth-John-Writeup.pdf)
# Build Instructions

### Running on Mac OS is by far the easiest, but we have also tested on Ubuntu 16.04.

 1. **Install or otherwise set your system python to python3.5**. We accomplish this using the tool pyenv. This is the version of python's bytecode that mypy is designed to run, other versions may be bytecode imcompatible and result in errors. We need a python installation because we bootstrap our python assembly off of python3.5 to avoid the complexity of parsing so we can focus on the virtual machine alone.

 2. You will need to brew install gcc-8, gcc-7 also works but you will need to change lines 5 and 6 of the CMakeLists.txt to reflect that change.

 3. Run the following commads to build
```
git clone <repo> MyPy 
cd MyPy
git submodule init 
git submodule update -r 
mkdir -p build 
cd build 
cmake ..
make -j8
```

# Running Python Scripts
to run a program simply pipe the source code into mypy i.e.
```
cat myprogram.py | ./mypy 
```
or you can pass mypy a file name i.e
```
./mypy myprogram.py
```

Note that mypy only works when executed from the build directory (./build) as it invokes helper processes that are found via relative paths to the processes working directory (most importantly the file ../pytools/compile.py where we bootstrap off of python3.5 to generate our disassembly).

# Running Tests
running tests is as simple as running 
```
./cmake_test 
```
and you should see our tests running! if you get errors make sure to check that you have the correct python version installed.

# Sources 
 - https://github.com/python/cpython/blob/master/Include/typeslots.h
 - https://tech.blog.aknin.name/tag/block-stack/ 
 - https://docs.python.org/3/reference/ 
 - https://www.ojdip.net/2014/06/simple-jit-compiler-cpp/
 - https://late.am/post/2012/03/26/exploring-python-code-objects.html 
 - https://docs.python.org/2/library/code.html#module-code
 - https://tech.blog.aknin.name/2010/05/26/pythons-innards-pystate/ 
 - http://unpyc.sourceforge.net/Opcodes.html 
 - https://docs.python.org/2/c-api/function.html 
 - https://github.com/jasongros619/Project-Euler 
