var technoCipherInbox = 'sandhyatech@gmail.com.com';

document.addEventListener('DOMContentLoaded', function () {
    if (window.AOS && typeof window.AOS.init === 'function') {
        window.AOS.init({
            duration: 700,
            once: true,
            offset: 50
        });
    } else {
        document.querySelectorAll('[data-aos]').forEach(function (element) {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }

    var dobInput = document.getElementById('dob');
    if (dobInput) {
        var todayIso = new Date().toISOString().split('T')[0];
        dobInput.setAttribute('max', todayIso);
        // Ensure native calendar opens reliably on supported browsers.
        if (typeof dobInput.showPicker === 'function') {
            dobInput.addEventListener('focus', function () {
                try { dobInput.showPicker(); } catch (e) { }
            });
            dobInput.addEventListener('click', function () {
                try { dobInput.showPicker(); } catch (e) { }
            });
        }
        dobInput.addEventListener('change', function () {
            var selectedDate = new Date(dobInput.value);
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dobInput.value && selectedDate > today) {
                dobInput.value = '';
                alert('Date of Birth cannot be in the future.');
            }
        });
    }

    var toggleBtn = document.getElementById('chatbotToggle');
    var closeBtn = document.getElementById('chatbotClose');
    var panel = document.getElementById('chatbotPanel');
    var form = document.getElementById('chatbotForm');
    var input = document.getElementById('chatbotInput');
    var body = document.getElementById('chatbotBody');
    var avatar = document.getElementById('chatbotAvatar');
    var greeting = document.getElementById('chatbotGreeting');
    var greetingClose = document.getElementById('greetingClose');
    var chatbotName = document.getElementById('chatbotName');
    var chatbotEmail = document.getElementById('chatbotEmail');
    var chatbotPhone = document.getElementById('chatbotPhone');
    var chatbotStatus = document.getElementById('chatbotStatus');
    var faqButtons = document.querySelectorAll('.chatbot-faq-chip');
    var sendButton = form ? form.querySelector('button[type="submit"]') : null;
    var clickableLinks = document.querySelectorAll('a.nav-link, a.footer-link, .social-icons a, a.contact-email-link');
    var chatbotBusy = false;

    if (avatar && !avatar.getAttribute('src')) {
        avatar.setAttribute('src', 'chatbot.png');
    }

    // Show greeting after 4 seconds
    window.setTimeout(function () {
        if (greeting && (!panel || !panel.classList.contains('open'))) {
            greeting.classList.add('show');
            if (toggleBtn) toggleBtn.classList.add('pulse');
        }
    }, 4000);

    function setPanel(open) {
        if (!panel) return;
        panel.classList.toggle('open', open);
        if (open) {
            if (greeting) greeting.classList.remove('show');
            if (toggleBtn) toggleBtn.classList.remove('pulse');
            if (input) input.focus();
        }
    }

    function isServedOverHttp() {
        return window.location.protocol === 'http:' || window.location.protocol === 'https:';
    }

    function setChatbotStatus(type, message) {
        if (!chatbotStatus) return;
        chatbotStatus.hidden = false;
        chatbotStatus.className = 'chatbot-status is-' + type;
        chatbotStatus.textContent = message;
    }

    function clearChatbotStatus() {
        if (!chatbotStatus) return;
        chatbotStatus.hidden = true;
        chatbotStatus.className = 'chatbot-status';
        chatbotStatus.textContent = '';
    }

    function getChatbotDetails() {
        return {
            name: chatbotName ? chatbotName.value.trim() : '',
            email: chatbotEmail ? chatbotEmail.value.trim() : '',
            phone: chatbotPhone ? chatbotPhone.value.trim() : ''
        };
    }

    function validateChatbotDetails(details) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var phonePattern = /^[0-9+()\-\s]{7,20}$/;

        if (!details.name) {
            return {
                field: chatbotName,
                message: 'Please enter your name before sending a query.'
            };
        }

        if (!details.email) {
            return {
                field: chatbotEmail,
                message: 'Please enter your email address before sending a query.'
            };
        }

        if (!emailPattern.test(details.email)) {
            return {
                field: chatbotEmail,
                message: 'Please enter a valid email address.'
            };
        }

        if (!details.phone) {
            return {
                field: chatbotPhone,
                message: 'Please enter your phone number before sending a query.'
            };
        }

        if (!phonePattern.test(details.phone)) {
            return {
                field: chatbotPhone,
                message: 'Please enter a valid phone number.'
            };
        }

        return null;
    }

    function submitChatbotLead(details, queryText) {
        var formData = new FormData();
        formData.append('form_type', 'Website Chatbot Inquiry');
        formData.append('name', details.name);
        formData.append('email', details.email);
        formData.append('phone', details.phone);
        formData.append('query', queryText);
        formData.append('message', queryText);
        formData.append('source', 'Website Chatbot');
        formData.append('page_url', window.location.href);
        formData.append('_replyto', details.email);
        formData.append('_subject', 'New chatbot inquiry from ' + details.name);
        formData.append('_captcha', 'false');
        formData.append('_template', 'table');

        return fetch('https://formsubmit.co/ajax/' + technoCipherInbox, {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            body: formData
        }).then(function (response) {
            return response.json().catch(function () {
                return {};
            }).then(function (result) {
                if (!response.ok || result.success === false || result.success === 'false') {
                    throw new Error(result.message || 'Submission failed.');
                }
                return result;
            });
        });
    }

    function appendMessage(text, role) {
        if (!body) return;
        var msg = document.createElement('div');
        msg.className = 'chat-msg ' + role;
        msg.textContent = text;
        body.appendChild(msg);
        body.scrollTop = body.scrollHeight;
    }

    function showTyping() {
        if (!body) return;
        var typing = document.createElement('div');
        typing.className = 'typing';
        typing.id = 'botTyping';
        typing.innerHTML = '<span></span><span></span><span></span>';
        body.appendChild(typing);
        body.scrollTop = body.scrollHeight;
    }

    function hideTyping() {
        var typing = document.getElementById('botTyping');
        if (typing) typing.remove();
    }

    function botReply(userText) {
        const text = (userText || '').toLowerCase();

        if (text.includes('service') || text.includes('what do you do')) {
            return "We specialize in Custom Software, Web & Mobile Apps, AI/ML Solutions, and SaaS Development. Which area are you interested in?";
        }

        if (text.includes('contact') || text.includes('call') || text.includes('phone') || text.includes('email')) {
            return "You can reach us at sandhyatech@gmail.com  We're also based in Pune, India!";
        }

        if (text.includes('career') || text.includes('job') || text.includes('intern') || text.includes('hiring')) {
            return "We're always looking for talent! Please check our Careers section below and click 'Apply Now' for current openings.";
        }

        if (text.includes('price') || text.includes('cost') || text.includes('budget')) {
            return "Project costs vary based on requirements. Please send us your project details via the Contact form, and we'll provide a custom quote!";
        }

        if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning')) {
            return "Our AI experts can help you with Generative AI, Predictive Analytics, and intelligent automation. Would you like to see our AI services?";
        }

        if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
            return "Hi there! 👋 Welcome to Sandhya Tech. How can I assist you with your digital goals today?";
        }

        if (text.includes('thank')) {
            return "You're very welcome! Let us know if you need anything else.";
        }

        return "That's interesting! Could you tell me more about your requirements? Our team would love to help.";
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            var isOpen = panel && panel.classList.contains('open');
            setPanel(!isOpen);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            setPanel(false);
        });
    }

    // Close the chatbot when clicking anywhere outside the chatbot wrapper.
    document.addEventListener('click', function (event) {
        if (!panel || !panel.classList.contains('open')) return;
        var clickedInsideChatbot = event.target && event.target.closest('#chatbotWrapper');
        if (!clickedInsideChatbot) {
            setPanel(false);
        }
    });

    if (greetingClose) {
        greetingClose.addEventListener('click', function (e) {
            e.stopPropagation();
            if (greeting) greeting.classList.remove('show');
            if (toggleBtn) toggleBtn.classList.remove('pulse');
        });
    }

    if (faqButtons.length) {
        faqButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var questionText = button.getAttribute('data-question') || button.textContent || '';
                if (!questionText) return;

                appendMessage(questionText, 'user');
                showTyping();

                window.setTimeout(function () {
                    hideTyping();
                    appendMessage(botReply(questionText), 'bot');
                }, 700);
            });
        });
    }

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!input || chatbotBusy) return;
            var userText = input.value.trim();
            if (!userText) return;
            var details = getChatbotDetails();
            var validationError = validateChatbotDetails(details);
            var baseReply = botReply(userText);

            appendMessage(userText, 'user');
            input.value = '';
            clearChatbotStatus();

            if (validationError) {
                setChatbotStatus('error', validationError.message);
                appendMessage(baseReply + ' Please add your name, email, and phone number above so our team can contact you.', 'bot');
                if (validationError.field) validationError.field.focus();
                return;
            }

            if (!isServedOverHttp()) {
                var localWarning = 'Open this page through Live Server or your hosted website before testing chatbot message delivery.';
                setChatbotStatus('error', localWarning);
                appendMessage(baseReply + ' ' + localWarning, 'bot');
                return;
            }

            chatbotBusy = true;
            if (sendButton) sendButton.disabled = true;
            showTyping();

            submitChatbotLead(details, userText).then(function () {
                hideTyping();
                setChatbotStatus('success', 'Thanks ' + details.name + '. Your details and query have been sent to our team.');
                appendMessage(baseReply + ' Our team has received your query and will contact you soon.', 'bot');
            }).catch(function () {
                hideTyping();
                setChatbotStatus('error', 'We could not send your chatbot query right now. Please try again or use the Contact form.');
                appendMessage(baseReply + ' I could not forward this message just now. Please try again or use the Contact form.', 'bot');
            }).finally(function () {
                chatbotBusy = false;
                if (sendButton) sendButton.disabled = false;
                if (input) input.focus();
            });
        });
    }

    if (clickableLinks.length) {
        clickableLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                clickableLinks.forEach(function (item) {
                    item.classList.remove('link-clicked');
                });
                link.classList.add('link-clicked');
            });
        });
    }

    // Intersection Observer to trigger when the specific ID is in view
    const observerOptions = {
        threshold: 0.4 // Trigger when 40% of the section is visible
    };

    const targetRow = document.querySelector('#stats-section');
    if ('IntersectionObserver' in window && targetRow) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (typeof startCounters === 'function') {
                        startCounters();
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statsObserver.observe(targetRow);
    }

    const container = document.getElementById('box-wall');
    const colors = ['#FDF2D1', '#8ED1D1', '#D4E5B2', '#E07A5F'];

    if (container) {
        // This loop creates boxes in a zig-zag pattern
        for (let i = 0; i < 50; i++) {
            const box = document.createElement('div');

            // 1. Consistent color rotation
            const randomColor = colors[i % colors.length];

            // 2. Zig-zag layout between rows.
            const zigZagMargin = (i % 2 === 0) ? 'mt-0' : 'mt-5';

            box.className = `square-box ${zigZagMargin} shadow-sm`;
            box.style.backgroundColor = randomColor;

            // 3. Staggered animation
            box.style.animationDelay = `${i * 0.05}s`;

            container.appendChild(box);
        }
    }
});
document.addEventListener('DOMContentLoaded', function () {
    var contactForm = document.getElementById('contactForm');
    var applyForm = document.getElementById('applyForm');
    var contactStatus = document.getElementById('contactFormStatus');
    var applyStatus = document.getElementById('applyFormStatus');
    // Update this inbox if FormSubmit is activated on a different mailbox.
    var formSubmitRecipient = technoCipherInbox;

    function setStatus(target, type, message) {
        if (!target) return;
        target.hidden = false;
        target.className = 'alert mt-2 mb-0 ' + (type === 'success' ? 'alert-success' : 'alert-danger');
        target.textContent = message;
    }

    function clearStatus(target) {
        if (!target) return;
        target.hidden = true;
        target.textContent = '';
    }

    function isServedOverHttp() {
        return window.location.protocol === 'http:' || window.location.protocol === 'https:';
    }

    function pageBaseUrl() {
        return window.location.href.split('?')[0].split('#')[0];
    }

    function buildFormSubmitEndpoint(recipient, useAjax) {
        return 'https://formsubmit.co/' + (useAjax ? 'ajax/' : '') + recipient;
    }

    function syncFormAction(form) {
        if (!form) return '';

        var action = form.getAttribute('action') || '';
        if (!action || /^https:\/\/formsubmit\.co\/(ajax\/)?/i.test(action)) {
            action = buildFormSubmitEndpoint(formSubmitRecipient, false);
            form.setAttribute('action', action);
        }

        return action;
    }

    function closeApplyModal() {
        var modalElement = document.getElementById('applyModal');
        if (!window.bootstrap || !modalElement) return;
        var modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            window.setTimeout(function () {
                modalInstance.hide();
            }, 1200);
        }
    }

    function showContactSuccessPopup() {
        var modalElement = document.getElementById('contactSuccessModal');
        if (!modalElement || !window.bootstrap) return;
        var modalInstance = new window.bootstrap.Modal(modalElement);
        modalInstance.show();
    }

    function showApplicationSuccessPopup() {
        var modalElement = document.getElementById('applicationSuccessModal');
        if (!modalElement || !window.bootstrap) return;
        var modalInstance = new window.bootstrap.Modal(modalElement);
        modalInstance.show();
    }

    function setFormReturnUrls() {
        if (!isServedOverHttp()) {
            var warning = 'Open this page through Live Server or your hosted website before testing the forms.';
            setStatus(contactStatus, 'error', warning);
            setStatus(applyStatus, 'error', warning);
            return;
        }

        syncFormAction(contactForm);
        syncFormAction(applyForm);

        var baseUrl = pageBaseUrl();
        var contactNext = document.getElementById('contactFormNext');
        var contactUrl = document.getElementById('contactFormUrl');
        var applyNext = document.getElementById('applyFormNext');
        var applyUrl = document.getElementById('applyFormUrl');

        if (contactNext) contactNext.value = baseUrl + '?formStatus=contact-success#contact';
        if (contactUrl) contactUrl.value = baseUrl + '#contact';
        if (applyNext) applyNext.value = baseUrl + '?formStatus=application-success#careers';
        if (applyUrl) applyUrl.value = baseUrl + '#careers';
    }

    function showStatusFromQuery() {
        var params = new URLSearchParams(window.location.search);
        var formStatus = params.get('formStatus');

        if (formStatus === 'contact-success') {
            setStatus(contactStatus, 'success', 'Your message has been sent successfully.');
            showContactSuccessPopup();
        }

        if (formStatus === 'application-success') {
            setStatus(applyStatus, 'success', 'Your application has been sent successfully.');
            showApplicationSuccessPopup();
        }

        if (!formStatus) return;

        params.delete('formStatus');
        var newQuery = params.toString();
        var cleanUrl = window.location.pathname + (newQuery ? '?' + newQuery : '') + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
    }

    function wireForm(config) {
        var form = document.getElementById(config.formId);
        var statusBox = document.getElementById(config.statusId);
        if (!form) return;

        var submitButton = form.querySelector('button[type="submit"]');
        var originalButtonHtml = submitButton ? submitButton.innerHTML : '';

        form.addEventListener('submit', function (event) {
            if (!isServedOverHttp()) {
                event.preventDefault();
                setStatus(statusBox, 'error', 'Open this page through Live Server or your hosted website before testing the forms.');
                return;
            }

            if (!form.reportValidity()) {
                return;
            }

            clearStatus(statusBox);
            syncFormAction(form);

            var nextField = form.querySelector('input[name="_next"]');
            var urlField = form.querySelector('input[name="_url"]');
            if (nextField) nextField.value = pageBaseUrl() + config.successQuery;
            if (urlField) urlField.value = pageBaseUrl() + config.sectionHash;

            var formData = new FormData(form);

            if (typeof config.beforeSend === 'function') {
                var beforeSendError = config.beforeSend(formData, form);
                if (beforeSendError) {
                    event.preventDefault();
                    setStatus(statusBox, 'error', beforeSendError);
                    return;
                }
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = config.loadingLabel;
            }
            window.addEventListener('pageshow', function restoreButton() {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonHtml;
                }
                window.removeEventListener('pageshow', restoreButton);
            });
        });
    }

    setFormReturnUrls();
    showStatusFromQuery();

    wireForm({
        formId: 'contactForm',
        statusId: 'contactFormStatus',
        loadingLabel: 'Sending...',
        successMessage: 'Your message has been sent successfully.',
        errorMessage: 'We could not send your message right now. Please try again.',
        successQuery: '?formStatus=contact-success#contact',
        sectionHash: '#contact'
    });

    wireForm({
        formId: 'applyForm',
        statusId: 'applyFormStatus',
        loadingLabel: 'Submitting...',
        successMessage: 'Your application has been sent successfully.',
        errorMessage: 'We could not submit your application right now. Please try again.',
        successQuery: '?formStatus=application-success#careers',
        sectionHash: '#careers',
        beforeSend: function (formData) {
            var resumeFile = formData.get('resume');
            if (resumeFile && resumeFile.size > 10 * 1024 * 1024) {
                return 'Resume file size must be 10 MB or less.';
            }
            return '';
        }
    });
});
   
   
