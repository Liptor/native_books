import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

import { StyleSheet, Text, View, Image, SectionList } from 'react-native'

import BookItem from './BookItem'
import NYT from './NYT'

const BookList = () => {
    const [sections, setSections] = useState<any[]>([])

    useEffect(() => {
        _refreshData()
    })

    const _addKeysToBooks = books => {
        return books.map(book => {
            return Object.assign(book, { key: book.title })
        })
    }

    const _refreshData = () => {
        Promise
            .all([
                NYT.fetchBooks("hardcover-fiction"),
                NYT.fetchBooks("hardcover-nonfiction")
            ])
            .then(results => {
                if (results.length !== 2) {
                    console.error("Unexpected results");
                }

                setSections([
                        {
                            title: 'Hardcover Fiction',
                            data: _addKeysToBooks(results[0])
                        },
                        {
                            title: 'Hardcover NonFiction',
                            data: _addKeysToBooks(results[1])
                        }
                    ])
            })
    }

    const _renderItem = ({ item }) => {
        return (
            <BookItem
                coverURL={item.book_image}
                title={item.title}
                author={item.author}
            />
        )
    }

    const _renderHeader = ({ section }) => {
        return (
            <Text style={styles.headingText}>
                {section.title}
            </Text>
        )
    }

    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                renderItem={_renderItem}
                renderSectionHeader={_renderHeader}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex: 1, paddingTop: 22},
    headingText: {
        fontSize: 24,
        alignSelf: 'center',
        backgroundColor: '#FFF',
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 2,
        paddingBottom: 2
    }
})

export default BookList