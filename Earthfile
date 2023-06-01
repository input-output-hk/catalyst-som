VERSION 0.7
FROM earthly/dind:alpine
WORKDIR /full

e2e:
    FROM ./milestone-tracker-backend+initialize
    WITH DOCKER \
        --load frontend:latest=./milestone-tracker-frontend+docker \
        --load tests:latest=./milestone-tracker-tests+docker
        RUN npx supabase start -x imgproxy,inbucket,edge-runtime,logflare,vector,storage,studio && \
            npx supabase db reset && \
            docker run -d -p 5173:80 frontend:latest && \
            sleep 5 && \
            docker run --network host tests:latest
    END