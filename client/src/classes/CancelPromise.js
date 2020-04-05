// const moment = require('moment');

export class ChatSearch {
    #cancel = false;
    #cancelled = false;
    #running = true;
    #filter;
    #words;

    cancel = () => this.#cancel = true
    cancelled = () => this.#cancelled
    running = () => this.#running

    constructor(searchChat, filter) {
        this.#filter = filter;
        this.#words = this.getWords(filter);

        this.promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.condition(searchChat)) {
                    this.#running = false;
                    if (this.#cancel) {
                        this.#cancelled = true;
                        reject('cancel');
                    } else {
                        resolve(searchChat);
                    }
                } else {
                    this.#running = false;
                    if (this.#cancel) {
                        this.#cancelled = true;
                        reject('cancel');
                    } else {
                        reject('no match');
                    }
                }
            });
        });
    }

    condition(searchChat) {
        return (
            searchChat[searchChat.match].toLowerCase().includes(this.#filter) ||
            this.searchChatForMessage(searchChat.messages)
        );
    }

    getWords(message) {
        let words = [];
        message = message.toLowerCase().split(' ');
        message.forEach(m => {
          if (m !== '') {
            words.push(m);
          }
        });
  
        return words;
    }

    searchChatForMessage(messages) {
        let wl = this.#words.length;
        let msgWords = [];
        let count;
        let message;
  
        for (let m = 0; m < messages.length; m++) {
          message = messages[m];
          if (message.txt) {
            msgWords = this.getWords(message.txt);
            for (let i = 0; i <= msgWords.length - wl; i++) {
              count = 0;
              for (let j = 0; j < wl; j++) {
                if (
                    j === wl - 1 &&
                    msgWords[i + j].startsWith(this.#words[j]) ||
                    this.#words[j] === msgWords[i + j]
                ) {
                    count++;
                } else break;
                if (this.#cancel) return false;
              }
  
              if (count === wl) return true;
              if (this.#cancel) return false;
            }
          }
          if (this.#cancel) return false;
        }
        
        return false;
    }
}

export class AdminUserSearch {
    #cancel = false;
    #cancelled = false;
    #running = true;
    #filter;

    cancel = () => this.#cancel = true
    cancelled = () => this.#cancelled
    running = () => this.#running

    constructor(userSearch, filter) {
        this.#filter = filter;

        this.promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.condition(userSearch) && !this.#cancel) {
                    resolve(userSearch);
                } else {
                    if (this.#cancel) {
                        this.#cancelled = true;
                        reject('cancel');
                    } else {
                        reject();
                    }
                }
            });
        })
    }

    condition(userSearch) {
        return (
            userSearch._id.includes(this.#filter) ||
            userSearch.email.toLowerCase().includes(this.#filter) ||
            `${userSearch.userInfo.fname} ${userSearch.userInfo.lname}`.toLowerCase().includes(this.#filter)
        );
    }
}

export class AdminChatSearch {
    #cancel = false;
    #cancelled = false;
    #running = true;
    #filter;

    cancel = () => this.#cancel = true
    cancelled = () => this.#cancelled
    running = () => this.#running

    constructor(chatSearch, filter) {
        this.#filter = filter;

        this.promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.condition(chatSearch) && !this.#cancel) {
                    resolve(chatSearch);
                } else {
                    if (this.#cancel) {
                        this.#cancelled = true;
                        reject('cancel');
                    } else {
                        reject();
                    }
                }
            });
        })
    }

    condition(chatSearch) {
        return (
            chatSearch._id.includes(this.#filter) ||
            chatSearch.u1.toLowerCase().includes(this.#filter) ||
            chatSearch.u2.toLowerCase().includes(this.#filter)
        );
    }
}

export class AdminReportSearch {
    #cancel = false;
    #cancelled = false;
    #running = true;
    #filter;

    cancel = () => this.#cancel = true
    cancelled = () => this.#cancelled
    running = () => this.#running

    constructor(chatSearch, filter) {
        this.#filter = filter;

        this.promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.condition(chatSearch) && !this.#cancel) {
                    resolve(chatSearch);
                } else {
                    if (this.#cancel) {
                        this.#cancelled = true;
                        reject('cancel');
                    } else {
                        reject();
                    }
                }
            });
        })
    }

    condition(chatSearch) {
        return (
            chatSearch._id.includes(this.#filter) ||
            chatSearch.status.includes(this.#filter) ||
            chatSearch.user.includes(this.#filter) ||
            chatSearch.reported.includes(this.#filter) ||
            chatSearch.reportType.includes(this.#filter)
        );
    }
}