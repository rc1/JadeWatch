# A folder watcher for jade files.

## install

    $ npm install jadewatch -g

## usage

    $ cd folder/with/jade/files
    $ jadewatch
    watching 1 jade files for changes. (jadewatch 0.0.3)

## help

	$ jadewatch --help

## command line options

Output filename extension. Defaults is `html`.

    $ jadewatch -e xsl
    watching 1 jade files for changes. (jadewatch 0.0.3)
    file.jade > file.xsl 13:00:08 GMT+0100 (BST)

Output beatified html. Use this options to have human readable html.

    $ jadewatch -b