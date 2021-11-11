;(this.webpackJsonpurl_app = this.webpackJsonpurl_app || []).push([
  [0],
  {
    103: function (e, t, n) {},
    104: function (e, t, n) {
      'use strict'
      n.r(t)
      var a = n(0),
        i = n.n(a),
        s = n(25),
        r = n.n(s),
        o = (n(70), n(21)),
        c = n(8),
        d = (n(71), n(72), n(37)),
        l = n(14),
        u = n(15),
        h = n(6),
        m = n(18),
        p = n(17),
        g = n(32),
        b = n(22),
        v = n(64),
        f = n(19),
        j = n(33),
        S = n(65),
        x = n(7),
        N = n.n(x),
        C = n(16),
        y = n(45),
        O = n(57),
        D = n.n(O),
        k = {
          isAdmin: function (e) {
            return 'isadmin' === e.pathname.split('/')[1]
          },
          _randomstring: function (e) {
            var t =
                !(arguments.length > 1 && void 0 !== arguments[1]) ||
                arguments[1],
              n = '',
              a = '0123456789'
            t && (a += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
            for (var i = a.length, s = 0; s < e; s++)
              n += a.charAt(Math.floor(Math.random() * i))
            return n
          },
          getEnvironmentList: function () {
            return ['RC', 'Staging', 'Prod Tech', 'Public prod']
          },
          getRandomSGTIN: function () {
            return this._randomstring(3, !1)
          },
          _removeDomainProtocol: function (e) {
            return (
              e.includes('https://')
                ? (e = e.replace('https://', ''))
                : e.includes('http://') && (e = e.replace('http://', '')),
              '/' === e.slice(e.length - 1) && (e = e.slice(0, -1)),
              e
            )
          },
          getColumnsNames: function () {
            return [
              { columnNameDB: 'brand', columnNameToDisplay: 'Brand' },
              {
                columnNameDB: 'environment',
                columnNameToDisplay: 'Environment',
              },
              { columnNameDB: 'domain', columnNameToDisplay: 'URL' },
              { columnNameDB: 'live', columnNameToDisplay: 'Live' },
              { columnNameDB: 'comment', columnNameToDisplay: 'Comment' },
              { columnNameDB: 'updated', columnNameToDisplay: 'Last update' },
            ]
          },
          isColumnAlwaysVisible: function (e) {
            return -1 !== ['brand', 'environment', 'domain'].indexOf(e)
          },
          getDBNameFromDisplayName: function (e) {
            for (var t = this.getColumnsNames(), n = 0; n < t.length; n++)
              if (t[n].columnNameToDisplay === e) return t[n].columnNameDB
          },
          getDisplayNameFromDBName: function (e) {
            for (var t = this.getColumnsNames(), n = 0; n < t.length; n++)
              if (t[n].columnNameDB === e) return t[n].columnNameToDisplay
          },
        },
        T = n(58),
        I = n
          .n(T)
          .a.create({
            baseURL:
              'https://fd902g59y1.execute-api.eu-west-1.amazonaws.com/prod',
            headers: {
              'Content-type': 'application/json',
              'x-api-key': 'ARISr1o5Cp5ElA4GyfbWeR4hgrZeINBaeLTuJZ04',
            },
          }),
        w = new ((function () {
          function e() {
            Object(l.a)(this, e)
          }
          return (
            Object(u.a)(e, [
              {
                key: 'getAll',
                value: function () {
                  return I.get('/domains')
                },
              },
              {
                key: 'get',
                value: function (e) {
                  return I.get('/domains/'.concat(e))
                },
              },
              {
                key: 'create',
                value: function (e) {
                  return I.put('/domains', e)
                },
              },
              {
                key: 'update',
                value: function (e, t) {
                  return I.put('/domains/'.concat(e), t)
                },
              },
              {
                key: 'delete',
                value: function (e) {
                  return I.delete('/domains/'.concat(e))
                },
              },
              {
                key: 'findByTitle',
                value: function (e) {
                  return I.get('/domains?title='.concat(e))
                },
              },
            ]),
            e
          )
        })())(),
        E = n(1),
        L = n(54),
        R = "Doesn't exist",
        F = 'Unknown server',
        M = 'Unable to get SSL',
        G = 'Unable to get the redirection',
        A = 'No redirection',
        W = "<span class='rolex-experience' >Rolex experience</span>",
        P =
          'https://fd902g59y1.execute-api.eu-west-1.amazonaws.com/prod/dnslookup?DNS=',
        U =
          'https://fd902g59y1.execute-api.eu-west-1.amazonaws.com/prod/getsslexpirydate?DNS=',
        B =
          'https://fd902g59y1.execute-api.eu-west-1.amazonaws.com/prod/getredirect?URL=',
        V = 'ARISr1o5Cp5ElA4GyfbWeR4hgrZeINBaeLTuJZ04',
        _ = (function (e) {
          Object(m.a)(n, e)
          var t = Object(p.a)(n)
          function n(e) {
            var a
            return (
              Object(l.a)(this, n),
              ((a = t.call(this, e)).setActiveDomain = a.setActiveDomain.bind(
                Object(h.a)(a),
              )),
              (a.setEditMode = a.setEditMode.bind(Object(h.a)(a))),
              (a.cancelEditMode = a.cancelEditMode.bind(Object(h.a)(a))),
              (a.validateComment = a.validateComment.bind(Object(h.a)(a))),
              (a.onChangeComment = a.onChangeComment.bind(Object(h.a)(a))),
              (a.state = {
                updateInProgress: !1,
                updateDNSInProgress: !1,
                updateSSLInProgress: !1,
                updateRedirWithSGTINInProgress: !1,
                updateRedirWithoutSGTINInProgress: !1,
                sgtin: k.getRandomSGTIN(),
              }),
              (a.state = {
                url: e.domain + '/' + a.state.sgtin,
                isSelected: !1,
                editMode: !1,
              }),
              a
            )
          }
          return (
            Object(u.a)(n, [
              {
                key: 'setEditMode',
                value: function (e) {
                  this.state.editMode || this.setState({ editMode: !0 })
                },
              },
              {
                key: 'onChangeComment',
                value: function (e) {
                  console.log('comment updated'),
                    this.setState({ comment: e.target.value })
                },
              },
              {
                key: 'cancelEditMode',
                value: function (e) {
                  console.log('Cancel comment'),
                    this.setState({ editMode: !1, comment: null })
                },
              },
              {
                key: 'validateComment',
                value: function (e) {
                  var t = this
                  if (this.state.comment) {
                    var n = Object.assign({}, this.props)
                    ;(n.comment = this.state.comment),
                      console.log('validate comment', n),
                      w
                        .update(n.uuid, n)
                        .then(function (e) {
                          console.log(e.data),
                            t.setState({
                              submitted: !0,
                              message: 'The domain was updated successfully!',
                            })
                        })
                        .catch(function (e) {
                          console.log(e)
                        }),
                      this.setState({ editMode: !1 })
                  } else this.setState({ editMode: !1 })
                },
              },
              {
                key: 'setActiveDomain',
                value: function () {
                  this.setState({ isSelected: !this.state.isSelected })
                },
              },
              { key: 'componentDidMount', value: function () {} },
              {
                key: 'componentDidUpdate',
                value: function () {
                  !0 !== this.props.update ||
                  this.state.updateInProgress ||
                  this.state.cname ||
                  this.state.otherRecords
                    ? !0 !== this.props.updateDNS ||
                      this.state.updateDNSInProgress ||
                      this.state.cname ||
                      this.state.otherRecords
                      ? !0 !== this.props.updateSSL ||
                        this.state.updateSSLInProgress ||
                        this.state.SSLExpiryDate
                        ? !0 !== this.props.updateRedirection ||
                          this.state.updateRedirWithoutSGTINInProgress ||
                          this.state.updateRedirWithSGTINInProgress ||
                          ('undefined' !== typeof this.state.redirects &&
                            'undefined' !==
                              typeof this.state.redirects.redirectWithSGTIN &&
                            'undefined' !==
                              typeof this.state.redirects
                                .redirectWithoutSGTIN) ||
                          (this.setState({
                            updateRedirWithoutSGTINInProgress: !0,
                            updateRedirWithSGTINInProgress: !0,
                          }),
                          this.getRedirectionDetails(this.props.domain))
                        : (this.setState({ updateSSLInProgress: !0 }),
                          this.getSSLDetails(this.props.domain))
                      : (this.setState({ updateDNSInProgress: !0 }),
                        this.getDNSDetails(this.props.domain))
                    : (this.setState({
                        updateInProgress: !0,
                        updateDNSInProgress: !0,
                        updateSSLInProgress: !0,
                        updateRedirWithSGTINInProgress: !0,
                        updateRedirWithoutSGTINInProgress: !0,
                      }),
                      this.getAllURLDetails(this.props.domain))
                },
              },
              {
                key: 'dnsExist',
                value: (function () {
                  var e = Object(C.a)(
                    N.a.mark(function e(t) {
                      return N.a.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return e.abrupt(
                                'return',
                                new Promise(function (e, n) {
                                  L(P + t, {
                                    method: 'GET',
                                    headers: { 'x-api-key': V },
                                  })
                                    .then(function (e) {
                                      return e.json()
                                    })
                                    .then(function (t) {
                                      e(t)
                                    })
                                    .catch(function (e) {
                                      console.log('getDNS err2', P + t, e), n(e)
                                    })
                                }),
                              )
                            case 1:
                            case 'end':
                              return e.stop()
                          }
                      }, e)
                    }),
                  )
                  return function (t) {
                    return e.apply(this, arguments)
                  }
                })(),
              },
              {
                key: 'getSSLExpiryDate',
                value: (function () {
                  var e = Object(C.a)(
                    N.a.mark(function e(t) {
                      return N.a.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return e.abrupt(
                                'return',
                                new Promise(function (e, n) {
                                  L(U + t, {
                                    method: 'GET',
                                    headers: { 'x-api-key': V },
                                  })
                                    .then(function (e) {
                                      return e.json()
                                    })
                                    .then(function (a) {
                                      return a.daysRemaining
                                        ? e(a.daysRemaining)
                                        : (console.log('getSSL err1', U + t, a),
                                          n(a))
                                    })
                                    .catch(function (e) {
                                      console.log('getSSL err2', U + t, e), n(e)
                                    })
                                }),
                              )
                            case 1:
                            case 'end':
                              return e.stop()
                          }
                      }, e)
                    }),
                  )
                  return function (t) {
                    return e.apply(this, arguments)
                  }
                })(),
              },
              {
                key: 'getRedirect',
                value: (function () {
                  var e = Object(C.a)(
                    N.a.mark(function e(t) {
                      return N.a.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return e.abrupt(
                                'return',
                                new Promise(function (e, n) {
                                  L(B + t, {
                                    method: 'GET',
                                    headers: { 'x-api-key': V },
                                  })
                                    .then(function (e) {
                                      return (
                                        e.ok ||
                                          (console.log(
                                            'getRedirect err',
                                            B + t,
                                            'Not a 200 response',
                                          ),
                                          n(e)),
                                        e.json()
                                      )
                                    })
                                    .then(function (t) {
                                      return e(t)
                                    })
                                    .catch(function (e) {
                                      console.log('getRedirect err', B + t, e),
                                        n(e)
                                    })
                                }),
                              )
                            case 1:
                            case 'end':
                              return e.stop()
                          }
                      }, e)
                    }),
                  )
                  return function (t) {
                    return e.apply(this, arguments)
                  }
                })(),
              },
              {
                key: 'getAllURLDetails',
                value: (function () {
                  var e = Object(C.a)(
                    N.a.mark(function e(t) {
                      return N.a.wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (e.next = 2), this.getDNSDetails(t)
                              case 2:
                                if (
                                  (!this.state.cname &&
                                    !this.state.otherRecords) ||
                                  this.state.cname === R
                                ) {
                                  e.next = 9
                                  break
                                }
                                return (e.next = 5), this.getSSLDetails(t)
                              case 5:
                                return (
                                  (e.next = 7), this.getRedirectionDetails(t)
                                )
                              case 7:
                                e.next = 10
                                break
                              case 9:
                                this.setState({
                                  SSLExpiryDate: M,
                                  redirects: {
                                    redirectWithoutSGTIN: { msg: G },
                                    redirectWithSGTIN: { msg: G },
                                  },
                                })
                              case 10:
                                this.setState({
                                  updateInProgress: !1,
                                  updateDNSInProgress: !1,
                                  updateSSLInProgress: !1,
                                  updateRedirWithoutSGTINInProgress: !1,
                                  updateRedirWithSGTINInProgress: !1,
                                })
                              case 11:
                              case 'end':
                                return e.stop()
                            }
                        },
                        e,
                        this,
                      )
                    }),
                  )
                  return function (t) {
                    return e.apply(this, arguments)
                  }
                })(),
              },
              {
                key: 'getDNSDetails',
                value: (function () {
                  var e = Object(C.a)(
                    N.a.mark(function e(t) {
                      var n, a, i, s, r
                      return N.a.wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (
                                  (n = {}),
                                  (e.prev = 1),
                                  (e.next = 4),
                                  this.dnsExist(k._removeDomainProtocol(t))
                                )
                              case 4:
                                if (
                                  ((a = e.sent),
                                  console.log('DNS response', a),
                                  !('CNAME' in a) || !a.CNAME[0])
                                ) {
                                  e.next = 10
                                  break
                                }
                                ;(i = a.CNAME[0]), (e.next = 15)
                                break
                              case 10:
                                if (!('otherrecords' in a)) {
                                  e.next = 14
                                  break
                                }
                                ;(s = a.otherrecords), (e.next = 15)
                                break
                              case 14:
                                throw Error('Record not found')
                              case 15:
                                this.setState({ cname: i, otherRecords: s }),
                                  (r = this.props.cnameMapping[i]
                                    ? this.props.cnameMapping[i]
                                    : this.props.cnameMapping[i + '.']
                                    ? this.props.cnameMapping[i + '.']
                                    : F),
                                  this.setState({ server: r }),
                                  (n[k._removeDomainProtocol(t)] = i + ' ' + r),
                                  this.props.parentCallback(n),
                                  (e.next = 28)
                                break
                              case 22:
                                ;(e.prev = 22),
                                  (e.t0 = e.catch(1)),
                                  this.setState({ cname: R }),
                                  (n[k._removeDomainProtocol(t)] = R),
                                  this.props.parentCallback(n),
                                  console.log(t + ': Error', e.t0)
                              case 28:
                                this.setState({ updateDNSInProgress: !1 })
                              case 29:
                              case 'end':
                                return e.stop()
                            }
                        },
                        e,
                        this,
                        [[1, 22]],
                      )
                    }),
                  )
                  return function (t) {
                    return e.apply(this, arguments)
                  }
                })(),
              },
              {
                key: 'getSSLDetails',
                value: (function () {
                  var e = Object(C.a)(
                    N.a.mark(function e(t) {
                      var n
                      return N.a.wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (
                                  (e.prev = 0),
                                  (e.next = 3),
                                  this.getSSLExpiryDate(
                                    k._removeDomainProtocol(t),
                                  )
                                )
                              case 3:
                                ;(n = e.sent),
                                  this.setState({ SSLExpiryDate: n }),
                                  (e.next = 11)
                                break
                              case 7:
                                ;(e.prev = 7),
                                  (e.t0 = e.catch(0)),
                                  this.setState({ SSLExpiryDate: M }),
                                  console.log(t + ': Error', e.t0)
                              case 11:
                                this.setState({ updateSSLInProgress: !1 })
                              case 12:
                              case 'end':
                                return e.stop()
                            }
                        },
                        e,
                        this,
                        [[0, 7]],
                      )
                    }),
                  )
                  return function (t) {
                    return e.apply(this, arguments)
                  }
                })(),
              },
              {
                key: 'getRedirectionDetails',
                value: (function () {
                  var e = Object(C.a)(
                    N.a.mark(function e(t) {
                      var n
                      return N.a.wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (
                                  (e.prev = 0),
                                  ((n = {}).redirectWithSGTIN = {}),
                                  (e.next = 5),
                                  this.getRedirect(this.state.url)
                                )
                              case 5:
                                ;(n.redirectWithSGTIN = e.sent),
                                  (n.redirectWithSGTIN.msg =
                                    n.redirectWithSGTIN.redirect),
                                  n.redirectWithSGTIN.redirect ===
                                    this.state.url &&
                                    (n.redirectWithSGTIN.msg = A),
                                  (e.next = 14)
                                break
                              case 10:
                                ;(e.prev = 10),
                                  (e.t0 = e.catch(0)),
                                  (n.redirectWithSGTIN.msg = G),
                                  console.log(t + ': Error', e.t0)
                              case 14:
                                return (
                                  this.setState({
                                    updateRedirWithSGTINInProgress: !1,
                                  }),
                                  (e.prev = 15),
                                  (n.redirectWithoutSGTIN = {}),
                                  (e.next = 19),
                                  this.getRedirect(t)
                                )
                              case 19:
                                ;(n.redirectWithoutSGTIN = e.sent),
                                  (n.redirectWithoutSGTIN.msg =
                                    n.redirectWithoutSGTIN.redirect),
                                  (n.redirectWithoutSGTIN.redirect !== t &&
                                    n.redirectWithoutSGTIN.redirect !==
                                      t + '/' &&
                                    n.redirectWithoutSGTIN.redirect + '/' !==
                                      t) ||
                                    (n.redirectWithoutSGTIN.msg = A),
                                  (e.next = 28)
                                break
                              case 24:
                                ;(e.prev = 24),
                                  (e.t1 = e.catch(15)),
                                  (n.redirectWithoutSGTIN.msg = G),
                                  console.log(t + ': Error', e.t1)
                              case 28:
                                this.setState({
                                  redirects: n,
                                  updateRedirWithoutSGTINInProgress: !1,
                                })
                              case 29:
                              case 'end':
                                return e.stop()
                            }
                        },
                        e,
                        this,
                        [
                          [0, 10],
                          [15, 24],
                        ],
                      )
                    }),
                  )
                  return function (t) {
                    return e.apply(this, arguments)
                  }
                })(),
              },
              {
                key: 'redirectionsWithSGTINisTheSameAsWithoutSGTIN',
                value: function () {
                  return (
                    !this.state.redirects.redirectWithoutSGTIN.redirect ||
                    this.state.redirects.redirectWithoutSGTIN.redirect.length <
                      1 ||
                    !this.state.redirects.redirectWithSGTIN.redirect ||
                    this.state.redirects.redirectWithSGTIN.redirect.length <
                      1 ||
                    !(
                      this.state.redirects.redirectWithoutSGTIN.redirect !==
                        this.state.redirects.redirectWithSGTIN.redirect &&
                      !this.state.redirects.redirectWithSGTIN.redirect.includes(
                        this.state.redirects.redirectWithoutSGTIN.redirect,
                      )
                    )
                  )
                },
              },
              {
                key: 'render',
                value: function () {
                  var e = this
                  if (!this.props.display) return null
                  var t = '',
                    n = this.state.cname
                  this.state.updateDNSInProgress && (t = 'updating'),
                    this.state.server === F && (t = 'warningCell'),
                    this.state.cname === R && (t = 'errorCell'),
                    'server' in this.state &&
                      (n =
                        (this.state.cname ? this.state.cname + '<br/>' : '') +
                        this.state.server)
                  var a = '',
                    i = ''
                  this.state.updateSSLInProgress && (a = 'updating'),
                    this.state.SSLExpiryDate === M
                      ? ((a = 'errorCell'), (i = M))
                      : this.state.SSLExpiryDate < 40
                      ? (a = 'warningCell')
                      : this.state.SSLExpiryDate &&
                        (i = this.state.SSLExpiryDate + ' days')
                  var s = '',
                    r = '',
                    c = !0
                  if (
                    (this.state.updateRedirWithoutSGTINInProgress &&
                      (s = 'updating'),
                    'undefined' !== typeof this.state.redirects &&
                      'undefined' !==
                        typeof this.state.redirects.redirectWithoutSGTIN
                          .redirect &&
                      'undefined' !==
                        typeof this.state.redirects.redirectWithSGTIN
                          .redirect &&
                      ((c =
                        this.redirectionsWithSGTINisTheSameAsWithoutSGTIN()),
                      this.state.redirects.redirectWithoutSGTIN.msg === G
                        ? ((s = 'errorCell'), (r = G))
                        : ((r = this.state.redirects.redirectWithoutSGTIN.msg),
                          this.state.redirects.redirectWithoutSGTIN.isRolex &&
                            (r += ' - ' + W)),
                      c ||
                        ((s = 'warningCell'),
                        (r =
                          'Without SGTIN: ' +
                          r +
                          '<br/>With SGTIN:' +
                          this.state.redirects.redirectWithSGTIN.msg),
                        this.state.redirects.redirectWithSGTIN.isRolex &&
                          (r += ' - ' + W))),
                    'redirectFilter' in this.props &&
                      this.props.redirectFilter.length > 0 &&
                      (r.length < 1 ||
                        !r
                          .toLowerCase()
                          .includes(this.props.redirectFilter.toLowerCase())))
                  )
                    return ''
                  var d,
                    l = [],
                    u = 0,
                    h = ''
                  if (this.props && 'columnsFilters' in this.props)
                    for (var m in this.props.columnsFilters)
                      this.props.columnsFilters[m].isVisible &&
                        ((d = ''),
                        (h = ''),
                        m in this.props && (d = this.props[m]),
                        'comment' === m &&
                          this.state.comment &&
                          (d = this.state.comment),
                        'comment' !== m ||
                          this.state.editMode ||
                          (d = d.replace(/(?:\r\n|\r|\n)/g, '<br>')),
                        this.props.isadmin &&
                          0 === u &&
                          this.state &&
                          this.state.isSelected &&
                          (h = Object(E.jsx)(o.b, {
                            to: '/isadmin/update/' + this.props.uuid,
                            className: 'edit badge badge-warning',
                            target: '_blank',
                            children: 'Edit',
                          })),
                        u++,
                        'comment' === m && this.state.editMode
                          ? l.push(
                              Object(E.jsxs)(
                                'td',
                                {
                                  onClick: this.setEditMode,
                                  children: [
                                    Object(E.jsx)('textarea', {
                                      name: 'comment',
                                      id: 'comment',
                                      className: 'form-control',
                                      onChange: this.onChangeComment,
                                      defaultValue: d,
                                      rows: '3',
                                    }),
                                    Object(E.jsx)('button', {
                                      onClick: this.cancelEditMode,
                                      className: 'badge badge-warning comment',
                                      children: 'Cancel',
                                    }),
                                    Object(E.jsx)('button', {
                                      onClick: this.validateComment,
                                      className: 'badge badge-success comment',
                                      children: 'Submit',
                                    }),
                                  ],
                                },
                                m,
                              ),
                            )
                          : 'comment' === m
                          ? l.push(
                              Object(E.jsx)(
                                'td',
                                {
                                  onClick: this.setEditMode,
                                  dangerouslySetInnerHTML: { __html: d },
                                },
                                m,
                              ),
                            )
                          : l.push(
                              Object(E.jsxs)('td', { children: [h, d] }, m),
                            ))
                  return Object(E.jsxs)('tr', {
                    onClick: function () {
                      return e.setActiveDomain()
                    },
                    children: [
                      l,
                      Object(E.jsx)('td', {
                        className: t,
                        dangerouslySetInnerHTML: { __html: n },
                      }),
                      Object(E.jsx)('td', { className: a, children: i }),
                      Object(E.jsx)('td', {
                        className: s,
                        dangerouslySetInnerHTML: { __html: r },
                      }),
                    ],
                  })
                },
              },
            ]),
            n
          )
        })(i.a.Component),
        z = n.p + 'static/media/Rolex_URL_working_copy.3ac17c38.csv',
        q = n(61),
        K = n(54),
        J = (function (e) {
          Object(m.a)(n, e)
          var t = Object(p.a)(n)
          function n(e) {
            var a
            return (
              Object(l.a)(this, n),
              ((a = t.call(this, e)).state = { domainsToCnames: {} }),
              (a.handleCallback = a.handleCallback.bind(Object(h.a)(a))),
              (a.state.loadingURLs = !1),
              a
            )
          }
          return (
            Object(u.a)(n, [
              {
                key: 'handleCallback',
                value: function (e) {
                  var t = Object(y.a)(
                    Object(y.a)({}, this.state.domainsToCnames),
                    e,
                  )
                  this.setState({ domainsToCnames: t })
                },
              },
              {
                key: 'getURLsFromCSV',
                value: (function () {
                  var e = Object(C.a)(
                    N.a.mark(function e() {
                      var t, n
                      return N.a.wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (e.next = 2), this.readCSV()
                              case 2:
                                for (t = e.sent, n = 0; n < t.length; n++)
                                  t[n].update = !1
                                console.log('URLS', t),
                                  this.setState({ urls: t })
                              case 6:
                              case 'end':
                                return e.stop()
                            }
                        },
                        e,
                        this,
                      )
                    }),
                  )
                  return function () {
                    return e.apply(this, arguments)
                  }
                })(),
              },
              {
                key: 'readCSV',
                value: (function () {
                  var e = Object(C.a)(
                    N.a.mark(function e() {
                      return N.a.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return e.abrupt(
                                'return',
                                K(z)
                                  .then(function (e) {
                                    return e.text()
                                  })
                                  .then(function (e) {
                                    return D.a.parse(e, {
                                      header: !0,
                                      skipEmptyLines: !0,
                                    }).data
                                  }),
                              )
                            case 1:
                            case 'end':
                              return e.stop()
                          }
                      }, e)
                    }),
                  )
                  return function () {
                    return e.apply(this, arguments)
                  }
                })(),
              },
              {
                key: 'retrieveDomains',
                value: (function () {
                  var e = Object(C.a)(
                    N.a.mark(function e() {
                      var t = this
                      return N.a.wrap(
                        function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (
                                  this.setState({ loadingURLs: !0 }),
                                  (e.next = 3),
                                  w
                                    .getAll()
                                    .then(function (e) {
                                      for (
                                        var n = e.data.Items, a = 0;
                                        a < n.length;
                                        a++
                                      )
                                        n[a].update = !1
                                      t.setState({
                                        domains: n,
                                        loadingURLs: !1,
                                      }),
                                        t.orderDomains()
                                    })
                                    .catch(function (e) {
                                      console.log(e)
                                    })
                                )
                              case 3:
                              case 'end':
                                return e.stop()
                            }
                        },
                        e,
                        this,
                      )
                    }),
                  )
                  return function () {
                    return e.apply(this, arguments)
                  }
                })(),
              },
              {
                key: 'orderDomains',
                value: function () {
                  this.setState({
                    domains: this.state.domains.sort(function (e, t) {
                      var n = e.brand.localeCompare(t.brand)
                      return 0 !== n
                        ? n
                        : e.environment.localeCompare(t.environment)
                    }),
                  })
                },
              },
              {
                key: 'componentDidMount',
                value: function () {
                  this.retrieveDomains()
                },
              },
              {
                key: 'URLisFiltered',
                value: function (e) {
                  var t = k._removeDomainProtocol(e.brand)
                  if (
                    this.props.cnameFilter.length > 0 &&
                    (!(t in this.state.domainsToCnames) ||
                      !this.state.domainsToCnames[t]
                        .toLowerCase()
                        .includes(this.props.cnameFilter.toLowerCase()))
                  )
                    return !0
                  for (var n in this.props.columnsFilters)
                    if (
                      this.props.columnsFilters[n].isVisible &&
                      this.props.columnsFilters[n].filter &&
                      this.props.columnsFilters[n].filter.length > 0 &&
                      (!e[n] ||
                        !e[n]
                          .toLowerCase()
                          .includes(
                            this.props.columnsFilters[n].filter.toLowerCase(),
                          ))
                    )
                      return !0
                  return !1
                },
              },
              {
                key: 'render',
                value: function () {
                  var e = this
                  if (this.state && this.state.loadingURLs)
                    return Object(E.jsx)(g.a, {
                      children: Object(E.jsx)(b.a, {
                        sm: 12,
                        children: 'Loading the URLs ...',
                      }),
                    })
                  if (
                    !this.state ||
                    !('domains' in this.state) ||
                    this.state.domains.length < 1
                  )
                    return Object(E.jsx)(g.a, {
                      children: Object(E.jsx)(b.a, {
                        sm: 4,
                        children: 'No URLs provided.',
                      }),
                    })
                  var t = this.props.redirectFilter,
                    n = this.state.domains.map(function (n) {
                      var a = e.props.update,
                        i = e.props.updateDNS,
                        s = e.props.updateSSL,
                        r = e.props.updateRedirection,
                        o = !0
                      return (
                        e.URLisFiltered(n) &&
                          ((a = !1), (i = !1), (s = !1), (r = !1), (o = !1)),
                        (n.brand = n.brand.trim()),
                        Object(E.jsx)(
                          _,
                          {
                            uuid: n.uuid,
                            domain: n.domain,
                            brand: n.brand,
                            environment: n.environment,
                            live: n.live,
                            comment: n.comment,
                            updated: n.updated,
                            redirectFilter: t,
                            cnameMapping: q,
                            update: a,
                            updateDNS: i,
                            updateSSL: s,
                            updateRedirection: r,
                            display: o,
                            parentCallback: e.handleCallback,
                            columnsFilters: e.props.columnsFilters,
                            isadmin: e.props.isadmin,
                          },
                          n.domain,
                        )
                      )
                    })
                  return Object(E.jsx)('tbody', { children: n })
                },
              },
            ]),
            n
          )
        })(i.a.Component),
        Z = (function (e) {
          Object(m.a)(n, e)
          var t = Object(p.a)(n)
          function n(e) {
            var a
            return (
              Object(l.a)(this, n),
              ((a = t.call(this, e)).toggleChange = function () {
                a.setState({ isChecked: !a.state.isChecked }),
                  a.props.onChange(a.props.columnName, !a.state.isChecked)
              }),
              (a.state = { isChecked: a.props.defaultChecked }),
              a
            )
          }
          return (
            Object(u.a)(n, [
              {
                key: 'render',
                value: function () {
                  return Object(E.jsx)(f.a.Check, {
                    type: 'checkbox',
                    id: this.props.columnName,
                    label: this.props.columnName,
                    defaultChecked: this.state.isChecked,
                    onChange: this.toggleChange,
                  })
                },
              },
            ]),
            n
          )
        })(i.a.Component),
        H =
          'Too many URLs to proceed, please use the filters below first. If too many requests are triggered at the same time, some results may be wrong.',
        Y = (function (e) {
          Object(m.a)(n, e)
          var t = Object(p.a)(n)
          function n(e) {
            var a
            return (
              Object(l.a)(this, n),
              ((a = t.call(this, e)).handleURLsVerifications =
                a.handleURLsVerifications.bind(Object(h.a)(a))),
              (a.handleFilterColumnChange = a.handleFilterColumnChange.bind(
                Object(h.a)(a),
              )),
              (a.handleFilterCnameChange = a.handleFilterCnameChange.bind(
                Object(h.a)(a),
              )),
              (a.handleFilterRedirectChange = a.handleFilterRedirectChange.bind(
                Object(h.a)(a),
              )),
              (a.handleDNSVerifications = a.handleDNSVerifications.bind(
                Object(h.a)(a),
              )),
              (a.handleSSLVerifications = a.handleSSLVerifications.bind(
                Object(h.a)(a),
              )),
              (a.handleRedirection = a.handleRedirection.bind(Object(h.a)(a))),
              (a.handleColumnChange = a.handleColumnChange.bind(
                Object(h.a)(a),
              )),
              a
            )
          }
          return (
            Object(u.a)(n, [
              {
                key: 'handleKeyPress',
                value: function (e) {
                  'Enter' === e.key && e.preventDefault()
                },
              },
              {
                key: 'handleFilterColumnChange',
                value: function (e) {
                  var t = e.target.placeholder,
                    n = k.getDBNameFromDisplayName(t),
                    a = this.state.columnsFilters
                  ;(a[n].filter = e.target.value),
                    this.setState({ columnsFilters: a }),
                    this.setUpdateToFalse()
                },
              },
              {
                key: 'handleFilterCnameChange',
                value: function (e) {
                  this.setState({ cname: e.target.value, msg: '' }),
                    this.setUpdateToFalse()
                },
              },
              {
                key: 'handleFilterRedirectChange',
                value: function (e) {
                  this.setState({ redirectFilter: e.target.value, msg: '' }),
                    this.setUpdateToFalse()
                },
              },
              {
                key: 'handleColumnChange',
                value: function (e, t) {
                  var n = k.getDBNameFromDisplayName(e),
                    a = this.state.columnsFilters
                  ;(a[n] = { isVisible: t, filter: '', displayName: e }),
                    this.setState({ columnsFilters: a }),
                    this.setUpdateToFalse()
                },
              },
              {
                key: 'componentDidMount',
                value: function () {
                  for (
                    var e = k.getColumnsNames(), t = [], n = 0;
                    n < e.length;
                    n++
                  )
                    t[e[n].columnNameDB] = {
                      isVisible: k.isColumnAlwaysVisible(e[n].columnNameDB),
                      filter: '',
                      displayName: e[n].columnNameToDisplay,
                    }
                  this.setState({
                    columnsFilters: t,
                    site: '',
                    environment: '',
                    domain: '',
                    cname: '',
                    msg: '',
                  }),
                    this.setUpdateToFalse()
                },
              },
              { key: 'componentDidUpdate', value: function () {} },
              {
                key: 'isFilterActive',
                value: function () {
                  for (var e in this.state.columnsFilters)
                    if (
                      this.state.columnsFilters[e].isVisible &&
                      this.state.columnsFilters[e].filter &&
                      this.state.columnsFilters[e].filter.length > 0
                    )
                      return !0
                  return !1
                },
              },
              {
                key: 'setUpdateToFalse',
                value: function () {
                  this.setState({
                    update: !1,
                    updateDNS: !1,
                    updateSSL: !1,
                    updateRedirection: !1,
                  })
                },
              },
              {
                key: 'handleURLsVerifications',
                value: function () {
                  this.isFilterActive()
                    ? this.setState({ update: !0 })
                    : this.setState({ msg: H })
                },
              },
              {
                key: 'handleDNSVerifications',
                value: function () {
                  this.isFilterActive()
                    ? this.setState({ updateDNS: !0 })
                    : this.setState({ msg: H })
                },
              },
              {
                key: 'handleSSLVerifications',
                value: function () {
                  this.isFilterActive()
                    ? this.setState({ updateSSL: !0 })
                    : this.setState({ msg: H })
                },
              },
              {
                key: 'handleRedirection',
                value: function () {
                  this.isFilterActive()
                    ? this.setState({ updateRedirection: !0 })
                    : this.setState({ msg: H })
                },
              },
              {
                key: 'render',
                value: function () {
                  var e = ''
                  null != this.state &&
                    'cname' in this.state &&
                    (e = this.state.cname)
                  var t = ''
                  null != this.state &&
                    'redirectFilter' in this.state &&
                    (t = this.state.redirectFilter)
                  var n = !1
                  null != this.state &&
                    'update' in this.state &&
                    (n = this.state.update)
                  var a = !1
                  null != this.state &&
                    'updateDNS' in this.state &&
                    (a = this.state.updateDNS)
                  var i = !1
                  null != this.state &&
                    'updateSSL' in this.state &&
                    (i = this.state.updateSSL)
                  var s = !1
                  null != this.state &&
                    'updateRedirection' in this.state &&
                    (s = this.state.updateRedirection)
                  var r = [],
                    o = [],
                    c = [],
                    l = [],
                    u = []
                  if (this.state && 'columnsFilters' in this.state)
                    for (var h in ((u = this.state.columnsFilters),
                    this.state.columnsFilters)) {
                      var m = this.state.columnsFilters[h].isVisible
                      m &&
                        (o.push(Object(E.jsx)('td', {}, h)),
                        c.push(
                          Object(E.jsx)(
                            'td',
                            {
                              children:
                                this.state.columnsFilters[h].displayName,
                            },
                            h,
                          ),
                        ),
                        l.push(
                          Object(E.jsx)(
                            'td',
                            {
                              children: Object(E.jsx)(f.a, {
                                children: Object(E.jsx)(f.a.Control, {
                                  size: 'sm',
                                  type: 'text',
                                  placeholder:
                                    this.state.columnsFilters[h].displayName,
                                  value: this.state.columnsFilters[h].filter,
                                  onChange: this.handleFilterColumnChange,
                                  onKeyPress: this.handleKeyPress,
                                }),
                              }),
                            },
                            h,
                          ),
                        )),
                        r.push(
                          Object(E.jsx)(
                            Z,
                            {
                              columnName:
                                this.state.columnsFilters[h].displayName,
                              onChange: this.handleColumnChange,
                              defaultChecked: m,
                            },
                            h,
                          ),
                        )
                    }
                  return Object(E.jsxs)(d.a, {
                    fluid: !0,
                    children: [
                      Object(E.jsx)(b.a, {
                        sm: 9,
                        children: Object(E.jsx)(j.a, {
                          variant: 'outline-warning',
                          onClick: this.handleURLsVerifications,
                          className: 'mt-2 mb-2 main',
                          children: 'Test all',
                        }),
                      }),
                      Object(E.jsx)(g.a, {
                        children: Object(E.jsx)(b.a, {
                          sm: 9,
                          children: Object(E.jsx)(f.a, { children: r }),
                        }),
                      }),
                      Object(E.jsxs)(g.a, {
                        children: [
                          this.state &&
                            this.state.msg &&
                            this.state.msg.length > 0 &&
                            Object(E.jsx)(S.a, {
                              variant: 'danger',
                              children: this.state.msg,
                            }),
                          Object(E.jsx)(b.a, {
                            sm: 12,
                            children: Object(E.jsxs)(v.a, {
                              striped: !0,
                              bordered: !0,
                              hover: !0,
                              responsive: !0,
                              size: 'sm',
                              className: 'stubLinks',
                              children: [
                                Object(E.jsxs)('thead', {
                                  children: [
                                    Object(E.jsxs)('tr', {
                                      children: [
                                        o,
                                        Object(E.jsx)('td', {
                                          children: Object(E.jsx)(j.a, {
                                            variant: 'outline-info',
                                            onClick:
                                              this.handleDNSVerifications,
                                            children: 'Test',
                                          }),
                                        }),
                                        Object(E.jsx)('td', {
                                          children: Object(E.jsx)(j.a, {
                                            variant: 'outline-info',
                                            onClick:
                                              this.handleSSLVerifications,
                                            children: 'Test',
                                          }),
                                        }),
                                        Object(E.jsx)('td', {
                                          children: Object(E.jsx)(j.a, {
                                            variant: 'outline-info',
                                            onClick: this.handleRedirection,
                                            children: 'Test',
                                          }),
                                        }),
                                      ],
                                    }),
                                    Object(E.jsxs)('tr', {
                                      children: [
                                        c,
                                        Object(E.jsx)('td', {
                                          children: 'DNS',
                                        }),
                                        Object(E.jsx)('td', {
                                          children: 'SSL validity',
                                        }),
                                        Object(E.jsx)('td', {
                                          children: 'Redirect',
                                        }),
                                      ],
                                    }),
                                    Object(E.jsxs)('tr', {
                                      children: [
                                        l,
                                        Object(E.jsx)('td', {
                                          children: Object(E.jsx)(f.a, {
                                            children: Object(E.jsx)(
                                              f.a.Control,
                                              {
                                                size: 'sm',
                                                type: 'text',
                                                placeholder: 'DNS & server',
                                                value: e,
                                                onChange:
                                                  this.handleFilterCnameChange,
                                                onKeyPress: this.handleKeyPress,
                                              },
                                            ),
                                          }),
                                        }),
                                        Object(E.jsx)('td', {}),
                                        Object(E.jsx)('td', {
                                          children: Object(E.jsx)(f.a, {
                                            children: Object(E.jsx)(
                                              f.a.Control,
                                              {
                                                size: 'sm',
                                                type: 'text',
                                                placeholder: 'Redirect',
                                                value: t,
                                                onChange:
                                                  this
                                                    .handleFilterRedirectChange,
                                                onKeyPress: this.handleKeyPress,
                                              },
                                            ),
                                          }),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                Object(E.jsx)(J, {
                                  cnameFilter: e,
                                  redirectFilter: t,
                                  update: n,
                                  updateDNS: a,
                                  updateSSL: i,
                                  updateRedirection: s,
                                  columnsFilters: u,
                                  isadmin: this.props.isadmin,
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                    ],
                  })
                },
              },
            ]),
            n
          )
        })(i.a.Component),
        Q = n(108),
        X = n(107),
        $ = function () {
          var e = Object(c.f)(),
            t = !1
          return (
            k.isAdmin(e) && ((t = !0), console.log('isAdmin')),
            Object(E.jsxs)(Q.a, {
              expand: 'lg',
              variant: 'dark',
              bg: 'dark',
              children: [
                Object(E.jsx)(Q.a.Brand, {
                  as: o.b,
                  to: '/',
                  children: 'Rolex - URLs verification tool',
                }),
                Object(E.jsx)(Q.a.Collapse, {
                  children: Object(E.jsx)(X.a, {
                    children:
                      t &&
                      Object(E.jsxs)(E.Fragment, {
                        children: [
                          Object(E.jsx)(X.a.Link, {
                            as: o.b,
                            className: 'link',
                            to: '/isadmin',
                            children: 'Admin',
                          }),
                          Object(E.jsx)(X.a.Link, {
                            as: o.b,
                            className: 'link',
                            to: '/isadmin/add',
                            children: 'Add',
                          }),
                        ],
                      }),
                  }),
                }),
              ],
            })
          )
        },
        ee = n(98),
        te = (function (e) {
          Object(m.a)(n, e)
          var t = Object(p.a)(n)
          function n(e) {
            var a
            return (
              Object(l.a)(this, n),
              ((a = t.call(this, e)).onChangeDomain = a.onChangeDomain.bind(
                Object(h.a)(a),
              )),
              (a.onChangeBrand = a.onChangeBrand.bind(Object(h.a)(a))),
              (a.onChangeEnvironment = a.onChangeEnvironment.bind(
                Object(h.a)(a),
              )),
              (a.onChangeLive = a.onChangeLive.bind(Object(h.a)(a))),
              (a.onChangeComment = a.onChangeComment.bind(Object(h.a)(a))),
              (a.createNewDomain = a.createNewDomain.bind(Object(h.a)(a))),
              (a.updateDomain = a.updateDomain.bind(Object(h.a)(a))),
              (a.deleteDomain = a.deleteDomain.bind(Object(h.a)(a))),
              (a.newDomain = a.newDomain.bind(Object(h.a)(a))),
              (a.state = {
                currentDomain: {
                  uuid: null,
                  domain: '',
                  brand: '',
                  environment: 'RC',
                  live: 'N',
                  comment: '',
                },
                validationMsg: '',
                submitted: !1,
              }),
              a
            )
          }
          return (
            Object(u.a)(n, [
              {
                key: 'componentDidMount',
                value: function () {
                  this.props.match.params.id
                    ? (console.log('update page'),
                      this.setState({
                        validationMsg: '',
                        submitted: !1,
                        isNew: !1,
                      }),
                      this.loadDomain(this.props.match.params.id))
                    : (console.log('creation page'), this.newDomain())
                },
              },
              {
                key: 'newDomain',
                value: function () {
                  this.setState({
                    currentDomain: {
                      uuid: null,
                      domain: '',
                      brand: '',
                      environment: 'RC',
                      live: 'N',
                      comment: '',
                    },
                    validationMsg: '',
                    submitted: !1,
                    isNew: !0,
                  })
                },
              },
              {
                key: 'loadDomain',
                value: function (e) {
                  var t = this
                  w.get(e)
                    .then(function (e) {
                      t.setState({ currentDomain: e.data.Item }),
                        console.log('Getting item', e.data.Item)
                    })
                    .catch(function (e) {
                      console.log(e)
                    })
                },
              },
              {
                key: 'validateAndCleanDomain',
                value: function (e) {
                  if (!e) throw new Error('The domain should not be empty.')
                  if (
                    !(e = (e = (e = e.toLowerCase()).trim()).replace(
                      /\/$/,
                      '',
                    )).startsWith('https://')
                  )
                    throw new Error('[' + e + '] should start with "https://".')
                  var t = e.replace('https://', '')
                  if (!ee(t))
                    throw new Error('[' + t + '] is not a valid domain name.')
                  return e
                },
              },
              {
                key: 'validateBrand',
                value: function (e) {
                  if (!e) throw new Error('The brand should not be empty.')
                },
              },
              {
                key: 'validateAndCleanData',
                value: function () {
                  var e = this.state.currentDomain.domain
                  try {
                    ;(e = this.validateAndCleanDomain(e)),
                      this.validateBrand(this.state.currentDomain.brand)
                  } catch (t) {
                    return (
                      console.log(t.message),
                      this.setState({ validationMsg: t.message }),
                      null
                    )
                  }
                  return (
                    this.setState({ validationMsg: '' }),
                    {
                      uuid: this.state.currentDomain.uuid
                        ? this.state.currentDomain.uuid
                        : k._randomstring(12),
                      domain: e,
                      brand: this.state.currentDomain.brand.trim(),
                      environment: this.state.currentDomain.environment,
                      live: this.state.currentDomain.live,
                      comment: this.state.currentDomain.comment
                        ? this.state.currentDomain.comment.trim()
                        : '',
                    }
                  )
                },
              },
              {
                key: 'createNewDomain',
                value: function () {
                  var e = this,
                    t = this.validateAndCleanData()
                  t
                    ? (console.log('Creating ...', t),
                      w
                        .create(t)
                        .then(function (n) {
                          e.setState({ currentDomain: t, submitted: !0 }),
                            console.log(n.data)
                        })
                        .catch(function (e) {
                          console.log(e)
                        }))
                    : console.log('No data - not creating anything')
                },
              },
              {
                key: 'updateDomain',
                value: function () {
                  var e = this,
                    t = this.validateAndCleanData()
                  t
                    ? (console.log('Updating', t, t.uuid),
                      w
                        .update(t.uuid, t)
                        .then(function (t) {
                          console.log(t.data),
                            e.setState({
                              submitted: !0,
                              message: 'The domain was updated successfully!',
                            })
                        })
                        .catch(function (e) {
                          console.log(e)
                        }))
                    : console.log('No data - not creating anything')
                },
              },
              {
                key: 'deleteDomain',
                value: function () {
                  var e = this
                  console.log(
                    'Deleting domain',
                    this.state.currentDomain,
                    this.state.currentDomain.uuid,
                  ),
                    w
                      .delete(this.state.currentDomain.uuid)
                      .then(function (t) {
                        console.log(t.data), e.props.history.push('/isadmin')
                      })
                      .catch(function (e) {
                        console.log(e)
                      })
                },
              },
              {
                key: 'onChangeDomain',
                value: function (e) {
                  var t = this.state.currentDomain
                  ;(t.domain = e.target.value),
                    this.setState({ currentDomain: t })
                },
              },
              {
                key: 'onChangeBrand',
                value: function (e) {
                  var t = this.state.currentDomain
                  ;(t.brand = e.target.value),
                    this.setState({ currentDomain: t })
                },
              },
              {
                key: 'onChangeEnvironment',
                value: function (e) {
                  var t = this.state.currentDomain
                  ;(t.environment = e.target.value),
                    this.setState({ currentDomain: t })
                },
              },
              {
                key: 'onChangeLive',
                value: function (e) {
                  var t = this.state.currentDomain
                  ;(t.live = e.target.value),
                    this.setState({ currentDomain: t })
                },
              },
              {
                key: 'onChangeComment',
                value: function (e) {
                  var t = this.state.currentDomain
                  ;(t.comment = e.target.value),
                    this.setState({ currentDomain: t })
                },
              },
              {
                key: 'render',
                value: function () {
                  var e = this.state.currentDomain
                  return Object(E.jsxs)('div', {
                    className: 'submit-form',
                    children: [
                      this.state &&
                        this.state.validationMsg &&
                        Object(E.jsx)('div', {
                          className: 'alert alert-danger',
                          children: this.state.validationMsg,
                        }),
                      this.state &&
                        !this.state.isNew &&
                        (!e || !e.uuid) &&
                        Object(E.jsx)('div', {
                          className: 'alert alert-primary',
                          children: Object(E.jsx)('b', {
                            children: 'The domain has not been found.',
                          }),
                        }),
                      this.state &&
                        this.state.isNew &&
                        this.state.submitted &&
                        Object(E.jsxs)('div', {
                          children: [
                            Object(E.jsxs)('div', {
                              className: 'alert alert-success',
                              children: [
                                'The domain ',
                                Object(E.jsxs)('b', {
                                  children: ['"', e.domain, '"'],
                                }),
                                ' has been successfully created!',
                              ],
                            }),
                            Object(E.jsx)('button', {
                              className: 'btn btn-success',
                              onClick: this.newDomain,
                              children: 'Add another',
                            }),
                          ],
                        }),
                      this.state &&
                        !this.state.isNew &&
                        this.state.submitted &&
                        Object(E.jsx)('div', {
                          children: Object(E.jsxs)('div', {
                            className: 'alert alert-success',
                            children: [
                              'The domain ',
                              Object(E.jsx)('b', { children: e.domain }),
                              ' has been successfully updated!',
                            ],
                          }),
                        }),
                      this.state &&
                        e &&
                        (!this.state.isNew ||
                          (this.state.isNew && !this.state.submitted)) &&
                        Object(E.jsxs)('div', {
                          children: [
                            Object(E.jsxs)('div', {
                              className: 'form-group',
                              children: [
                                Object(E.jsx)('label', {
                                  htmlFor: 'domain',
                                  children: 'Domain',
                                }),
                                Object(E.jsx)('input', {
                                  type: 'text',
                                  className: 'form-control',
                                  id: 'domain',
                                  required: !0,
                                  defaultValue: e.domain,
                                  onChange: this.onChangeDomain,
                                  name: 'domain',
                                }),
                              ],
                            }),
                            Object(E.jsxs)('div', {
                              className: 'form-group',
                              children: [
                                Object(E.jsx)('label', {
                                  htmlFor: 'brand',
                                  children: 'Brand',
                                }),
                                Object(E.jsx)('input', {
                                  type: 'text',
                                  className: 'form-control',
                                  id: 'brand',
                                  required: !0,
                                  defaultValue: e.brand,
                                  onChange: this.onChangeBrand,
                                  name: 'brand',
                                }),
                              ],
                            }),
                            Object(E.jsxs)('div', {
                              className: 'form-group',
                              children: [
                                Object(E.jsx)('label', {
                                  htmlFor: 'environment',
                                  children: 'Environment',
                                }),
                                Object(E.jsx)('select', {
                                  className: 'custom-select',
                                  id: 'environment',
                                  required: !0,
                                  onChange: this.onChangeEnvironment,
                                  name: 'environment',
                                  value: e.environment,
                                  children: k
                                    .getEnvironmentList()
                                    .map(function (e) {
                                      return Object(E.jsx)('option', {
                                        value: e,
                                        children: e,
                                      })
                                    }),
                                }),
                              ],
                            }),
                            Object(E.jsxs)('div', {
                              className: 'form-group',
                              children: [
                                Object(E.jsx)('label', {
                                  htmlFor: 'live',
                                  children: 'Live',
                                }),
                                Object(E.jsxs)('select', {
                                  className: 'custom-select',
                                  id: 'live',
                                  required: !0,
                                  onChange: this.onChangeLive,
                                  name: 'live',
                                  value: e.live,
                                  children: [
                                    Object(E.jsx)('option', {
                                      value: 'N',
                                      children: 'N',
                                    }),
                                    Object(E.jsx)('option', {
                                      value: 'Y',
                                      children: 'Y',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            Object(E.jsxs)('div', {
                              className: 'form-group',
                              children: [
                                Object(E.jsx)('label', {
                                  htmlFor: 'comment',
                                  children: 'Comment',
                                }),
                                Object(E.jsx)('textarea', {
                                  name: 'comment',
                                  id: 'comment',
                                  className: 'form-control',
                                  onChange: this.onChangeComment,
                                  defaultValue: e.comment,
                                  rows: '6',
                                }),
                              ],
                            }),
                            this.state &&
                              this.state.isNew &&
                              !this.state.submitted &&
                              Object(E.jsx)('button', {
                                onClick: this.createNewDomain,
                                className: 'btn btn-success',
                                children: 'Submit',
                              }),
                            this.state &&
                              !this.state.isNew &&
                              Object(E.jsxs)(E.Fragment, {
                                children: [
                                  Object(E.jsx)('div', {
                                    className: 'deletebutton',
                                    children: Object(E.jsx)('button', {
                                      className: 'badge badge-danger mr-2',
                                      onClick: this.deleteDomain,
                                      children: 'Delete',
                                    }),
                                  }),
                                  Object(E.jsx)('div', {
                                    className: 'validatebutton',
                                    children: Object(E.jsx)('button', {
                                      type: 'submit',
                                      className: 'badge badge-success',
                                      onClick: this.updateDomain,
                                      children: 'Update',
                                    }),
                                  }),
                                ],
                              }),
                          ],
                        }),
                    ],
                  })
                },
              },
            ]),
            n
          )
        })(a.Component)
      n(103)
      var ne = function () {
          i.a.useEffect(function () {
            window.addEventListener('copy', function (e) {
              var t = document.getSelection().toString().trim(),
                n = e.clipboardData || window.clipboardData
              n.setData('text/plain', t),
                n.setData('text/html', t),
                e.preventDefault()
            })
          }, [])
          var e = Object(E.jsx)(d.a, {
            fluid: !0,
            children: Object(E.jsxs)(o.a, {
              children: [
                Object(E.jsx)($, {}),
                Object(E.jsxs)(c.c, {
                  children: [
                    Object(E.jsx)(c.a, {
                      exact: !0,
                      path: '/',
                      children: Object(E.jsx)(Y, { isadmin: !1 }),
                    }),
                    Object(E.jsx)(c.a, {
                      exact: !0,
                      path: '/isadmin',
                      children: Object(E.jsx)(Y, { isadmin: !0 }),
                    }),
                    Object(E.jsx)(c.a, {
                      exact: !0,
                      path: '/isadmin/add',
                      component: te,
                    }),
                    Object(E.jsx)(c.a, {
                      path: '/isadmin/update/:id',
                      component: te,
                    }),
                  ],
                }),
              ],
            }),
          })
          return r.a.render(e, document.getElementById('root'))
        },
        ae = function (e) {
          e &&
            e instanceof Function &&
            n
              .e(3)
              .then(n.bind(null, 109))
              .then(function (t) {
                var n = t.getCLS,
                  a = t.getFID,
                  i = t.getFCP,
                  s = t.getLCP,
                  r = t.getTTFB
                n(e), a(e), i(e), s(e), r(e)
              })
        }
      r.a.render(
        Object(E.jsx)(i.a.StrictMode, { children: Object(E.jsx)(ne, {}) }),
        document.getElementById('root'),
      ),
        ae()
    },
    61: function (e) {
      e.exports = JSON.parse(
        '{"Doesn\'t exist":"Doesn\'t exist","d2tgrthycnydha.cloudfront.net":"EU - AEM RC","d7jfzlujcu3eu.cloudfront.net":"EU - AEM RC","d3mn2vqiz3ym21.cloudfront.net":"EU - AEM staging","d1tp18hvhqt84x.cloudfront.net":"EU - AEM staging","d2720qrflec28g.cloudfront.net":"EU - AEM staging","d170u1z9c308qx.cloudfront.net":"EU - AEM staging","d1igjh9ccoc1nd.cloudfront.net":"EU - AEM staging","dvi1fny3rt29m.cloudfront.net":"EU - AEM staging","d3ufowzr1o4aka.cloudfront.net":"EU - AEM staging","d1zzisx9iavnpt.cloudfront.net":"EU - AEM staging","d2xyvbb3c0c5he.cloudfront.net":"EU - AEM staging","d99wsl52rc9kd.cloudfront.net":"EU - AEM Tech prod","qr-staging-lingyun.aptamil.lyuncloud.com":"CN - AEM staging","qr-staging-lingyun.lyuncloud.com":"CN - AEM staging","danone-stage64china-elb1cnnorth1-950695756.cn-north-1.elb.amazonaws.com.cn":"CN - AEM staging","Danone-Stage64China-elb1cnnorth1-950695756.cn-north-1.elb.amazonaws.com.cn":"CN - AEM staging","danone-stage64china-elb1cnnorth1-950695756.cn-north-1.elb":"CN - AEM staging","djt946bb0danl.cloudfront.net":"EU - AEM Public prod","dh80sbhfv2zfi.cloudfront.net":"EU - AEM Public prod","danone-prod64-china-elb1cnnorth1-208829668.cn-north-1.elb.amazonaws.com.cn":"CN - AEM Tech prod","danone.lyuncloud.com":"CN - AEM Public prod"}',
      )
    },
    70: function (e, t, n) {},
    71: function (e, t, n) {},
    72: function (e, t, n) {},
  },
  [[104, 1, 2]],
])
//# sourceMappingURL=main.8ea686ab.chunk.js.map
