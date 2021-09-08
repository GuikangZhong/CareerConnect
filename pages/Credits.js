import Navigation from '../components/Common/Navigation';

const Credits = () => {
    return (
        <>
            <Navigation />

            <div className="mt-3 ml-5 mr-5 mb-5">
                <div>
                    <h2 className="mt-4 mb-4">Credits</h2>
                </div>

                <div>
                    <h4 className="mb-3">Frontend</h4>
                    <ul>
                        <li className="mb-1">
                            Navigation bar style is from <a href="https://react-bootstrap.github.io/components/navbar/">React Bootstrap Navbars</a>
                        </li>
                        <li className="mb-1">
                            Card style is from <a href="https://react-bootstrap.github.io/components/cards/">React Bootstrap Cards</a>
                        </li>
                        <li className="mb-1">
                            Tag style is from <a href="https://react-bootstrap.github.io/components/badge/">React Bootstrap Badges</a>
                        </li>
                        <li className="mb-1">
                            Button style is from <a href="https://react-bootstrap.github.io/components/buttons/">React Bootstrap Buttons</a>
                        </li>
                        <li className="mb-1">
                            Form style is from <a href="https://react-bootstrap.github.io/components/forms/">React Bootstrap Forms</a> & <a href="https://react-bootstrap.github.io/components/input-group/">React Bootstrap InputGroup</a>
                        </li>
                        <li className="mb-1">
                            Popup window style is from <a href="https://react-bootstrap.github.io/components/modal/">React Bootstrap Modals</a>
                        </li>
                        <li className="mb-1">
                            Table style is from <a href="https://react-bootstrap.github.io/components/table/">React Bootstrap Tables</a>
                        </li>
                        <li className="mb-1">
                            Tab switching style is from <a href="https://react-bootstrap.github.io/components/tabs/">React Bootstrap Tabs</a>
                        </li>
                        <li className="mb-1">
                            Error/success message style is from <a href="https://material-ui.com/components/snackbars/">Material UI Snackbar</a> & <a href="https://material-ui.com/components/alert/">Material UI Alert</a>
                        </li>
                        <li className="mb-1">
                            Dropdown list is from <a href="https://www.npmjs.com/package/react-multiselect-dropdown-bootstrap">react-multiselect-dropdown-bootstrap</a>
                        </li>
                        <li className="mb-1">
                            Datetime picker is from <a href="https://www.npmjs.com/package/react-datetime-picker">react-datetime-picker</a>
                        </li>
                        <li className="mb-1">
                            Icons are from <a href="https://fontawesome.com/how-to-use/on-the-web/using-with/react">Font Awesome</a>
                        </li>
                        <li className="mb-1">
                            Some general styles are from <a href="https://getbootstrap.com/docs/4.0/getting-started/introduction/">Bootstrap v4.0</a>
                        </li>
                        <li className="mb-1">
                            fullcalendar is from<a href="https://fullcalendar.io/docs/react">fullcalendar</a>
                        </li>
                        <li className="mb-1">
                            Use cookies by <a href="https://www.npmjs.com/package/react-cookie#usecookiesdependencies">react-cookie</a>
                        </li>
                        <li className="mb-1">
                            Vertical timeline style is from <a href="https://www.npmjs.com/package/react-vertical-timeline-component">react-vertical-timeline-component</a>
                        </li>
                        <li className="mb-1">
                            Location searching is from <a href="https://www.npmjs.com/package/use-places-autocomplete">use-places-autocomplete</a>
                        </li>
                        <li className="mb-1">
                            Google Maps is from <a href="https://www.npmjs.com/package/@react-google-maps/api">@react-google-maps/api</a>, learning from <a href="https://www.youtube.com/watch?v=WZcxJGmLbSo&t=551s">online tutorial</a>
                        </li>
                        <li>
                            Default company logo made by <a href="https://www.iconfont.cn/user/detail?spm=a313x.7781069.1998910419.d9bd4f23f&uid=41077">六六村夫</a> from <a href="https://www.iconfont.cn/?spm=a313x.7781069.1998910419.d4d0a486a">www.iconfont.cn</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-3">Backend</h4>
                    <li className="mb-1">
                        The files compression functionality is from <a href="https://www.npmjs.com/package/archiver">https://www.npmjs.com/package/archiver</a>
                    </li>
                    <li className="mb-1">
                        The GraphQL with Express framwork is from <a href="https://graphql.org/graphql-js/running-an-express-graphql-server/">https://graphql.org/graphql-js/running-an-express-graphql-server/</a>
                    </li>
                    <li className="mb-1">
                        The fuzzy search with fusejs is from <a href="https://fusejs.io/">https://fusejs.io/</a>
                    </li>
                    <li className="mb-1">
                        The graphql-upload middleware for file upload is from <a href="https://github.com/jaydenseric/graphql-upload">https://github.com/jaydenseric/graphql-upload</a>
                    </li>
                    <li className="mb-1">
                        The mongodb object modeling is from <a href="https://mongoosejs.com/">https://mongoosejs.com/</a>
                    </li>
                    <li className="mb-1">
                        The email sending library is from <a href="https://nodemailer.com/about/">https://nodemailer.com/about/</a>
                    </li>
                    <li className="mb-1">
                        The websocket library is from <a href="https://socket.io/">https://socket.io/</a>
                    </li>
                    <li className="mb-1">
                        The webrtc peer library is from <a href="https://www.npmjs.com/package/simple-peer">https://www.npmjs.com/package/simple-peer</a>
                    </li>
                    <li className="mb-1">
                        The files storage in google bucket is from <a href="https://googleapis.dev/nodejs/storage/latest/index.html">https://googleapis.dev/nodejs/storage/latest/index.html</a>
                    </li>
                    <li className="mb-1">
                        The backend setup with GraphQL code is inspired by <a href="https://www.youtube.com/watch?v=7giZGFDGnkc&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_">https://www.youtube.com/watch?v=7giZGFDGnkc&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_</a>
                    </li>
                    <li className="mb-1">
                        The file upload with GraphQL code is inspired by <a href="https://morioh.com/p/b7558204c9e3">https://morioh.com/p/b7558204c9e3</a>
                    </li>
                    <li className="mb-1">
                        The email functionality is inspired by <a href="https://github.com/benawad/type-graphql-series/tree/5_confirm_email">https://github.com/benawad/type-graphql-series/tree/5_confirm_email</a>
                    </li>
                    <li className="mb-1">
                        The WebRTC functionality is inspired by <a href="https://github.com/coding-with-chaim/group-video-final">https://github.com/coding-with-chaim/group-video-final</a>
                    </li>
                </div>
                
            </div>
        </>
    );
}

export default Credits;