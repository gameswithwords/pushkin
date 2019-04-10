.. _get-pushkin:

Get Pushkin
=========================

Pushkin relies on the following programs, which can easily be installed with Homebrew - if you're on a Mac - or another package manager:
- node
- npm
- envsubst
- wget

After installing these, visit https://github.com/pushkin-consortium/pushkin_quickinstall and follow the instructions. This will download everything you need and set up the Command Line Tools (CLT).

.. note:: These docs assume that the  command 'pushkin' points to the CLT. If you choose not to do this, be aware that most of the docs will not work.

Once these are installed, run ``pushkin init`` to automatically install packages and set up the Pushkin environment.

Once you've got Pushkin downloaded and installed, see :ref:`new-quiz` to make a quiz.

Developing Pushkin
--------------------

If you are planning on contributing to pushkin, clone (or better yet, fork) from GitHub::

  git clone https://github.com/l3atbc-datadog/pushkin.git

You will then need to set up the CLT. To do that, after you have cloned pushkin, move to pushkin's root directory and run:

```
$ chmod +x pushkin_installCLT.sh

$ ./pushkin_installCLT.sh
```

This will also install the pushkin developer tools. (If you are using a fork, see the documentation for the CLT ``pushkin-tools release``.)

Next download and install Go from [here](https://golang.org/).

Next, we'll install [gothub](https://github.com/itchio/gothub), which is a set of tools for publishing software releases on github. The instructions in the README are incomplete, so follow the instructions below instead. First, run

```
$ go get github.com/itchio/gothub
```

Assuming you don't run into any snags, you should next add gothub to your Go path. This is probably in your `.bash_profile`. If it wasn't, you would almost certaintly know.

```
$ echo "export PATH=$PATH:$(go env GOPATH)/bin" >> ~/.bash_profile
```

Next, you'll need to get a Github token for the repository you are using (either the canonical repo or your fork). Follow instructions [here](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/). Then add the token to your bash profile:

```
$ echo "export GITHUB_TOKEN=... [<- with actual token]" >> ~/.bash_profile
```

THe developer tools should now be set up.





